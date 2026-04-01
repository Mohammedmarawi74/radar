import os
import pandas as pd
import json
from datetime import datetime
from db_connection import get_engine
import re
from sqlalchemy import text

# ==========================================
# 1. إعدادات الملفات
# ==========================================
RADAR_FILES_DIR = "radar files"
OUTPUT_JSON = "radar_posts.json"
TABLE_NAME = "real_estate_transactions"

COLUMN_MAPPING = {
    'المنطقة': 'region',
    'المدينة': 'city',
    'المدينة / الحي': 'neighborhood',
    'الرقم المرجعي للصفقة': 'reference_number',
    'تاريخ الصفقة ميلادي': 'gregorian_date',
    'تاريخ الصفقة هجري': 'hijri_date',
    'تصنيف العقار': 'property_type',
    'عدد العقارات': 'properties_count',
    'السعر': 'price',
    'المساحة': 'area'
}

def extract_year_quarter_from_filename(filename):
    """استخراج السنة والربع من اسم الملف"""
    year_match = re.search(r'(20\d{2})', filename)
    year = int(year_match.group(1)) if year_match else 2024
    
    quarter = "Q1"
    if "الأول" in filename or "الاول" in filename or "Q1" in filename:
        quarter = "Q1"
    elif "الثاني" in filename or "Q2" in filename:
        quarter = "Q2"
    elif "الثالث" in filename or "Q3" in filename:
        quarter = "Q3"
    elif "الرابع" in filename or "Q4" in filename:
        quarter = "Q4"
        
    return year, quarter

def upload_excel_files_to_mysql():
    """قراءة كل ملفات عام 2024 (الأرباع الأربعة) ورفعها"""
    engine = get_engine()
    
    if not os.path.exists(RADAR_FILES_DIR):
        print(f"❌ المجلد {RADAR_FILES_DIR} غير موجود.")
        return False
        
    excel_files = []
    for root, dirs, files in os.walk(RADAR_FILES_DIR):
        for file in files:
            if file.endswith(('.xlsx', '.xls')):
                filename = os.path.basename(file)
                year, quarter = extract_year_quarter_from_filename(filename)
                # !! فلترة لاختبار كامل عام 2024 (جميع الأرباع) !!
                if year == 2024:
                    excel_files.append(os.path.join(root, file))
                
    if not excel_files:
        print("❌ لم يتم العثور على أي ملفات تخص عام 2024.")
        return False
        
    print(f"🔍 تم العثور على {len(excel_files)} ملفات تخص عام 2024. جاري المعالجة...")
    
    with engine.begin() as conn:
        conn.execute(text(f"DELETE FROM {TABLE_NAME} WHERE year=2024"))
        print("🧹 تم تنظيف بيانات 2024 بالكامل لمنع التكرار.")
        
    for file_path in excel_files:
        filename = os.path.basename(file_path)
        y, q = extract_year_quarter_from_filename(filename)
        print(f"🔄 جاري رفع: {filename} (الربع: {q})...")
        
        try:
            df = pd.read_excel(file_path)
            df.columns = df.columns.astype(str).str.strip()
            
            rename_dict = {}
            for arabic_col, eng_col in COLUMN_MAPPING.items():
                for current_col in df.columns:
                    if arabic_col in current_col:
                        rename_dict[current_col] = eng_col
                        break
            df.rename(columns=rename_dict, inplace=True)
            
            if 'price' in df.columns:
                df['price'] = pd.to_numeric(df['price'].astype(str).str.replace(',', ''), errors='coerce').fillna(0)
            if 'area' in df.columns:
                df['area'] = pd.to_numeric(df['area'].astype(str).str.replace(',', ''), errors='coerce').fillna(0)
            
            df['year'] = y
            df['quarter'] = q
            
            expected_cols = list(COLUMN_MAPPING.values()) + ['year', 'quarter']
            df_to_insert = df[[c for c in expected_cols if c in df.columns]]
            
            df_to_insert.to_sql(TABLE_NAME, con=engine, if_exists='append', index=False)
            print(f"✅ تم رفع الملف {filename} بنجاح!")
        except Exception as e:
            print(f"❌ حدث خطأ أثناء معالجة الملف {filename}:\n{e}")
            
    return True

# ==========================================
# 2. استخراج التحليلات لتوليد الـ 21 منشوراً الأساسيين + الترندات
# ==========================================
def generate_posts_from_db():
    print("📊 جاري توليد المنشورات من قاعدة البيانات (نسخة متقدمة للعام 2024 كاملا)...")
    engine = get_engine()
    now = datetime.now().isoformat()
    posts = []
    
    def format_money(val):
        if val > 1e9: return f"{val/1e9:.2f} مليار"
        if val > 1e6: return f"{val/1e6:.2f} مليون"
        return f"{val:,.0f}"

    try:
        # -----------------------------------------------------------------------------------
        # 1. التوليد للمنشورات ה21 الأساسية العميقة (ولكن محسوبة على 2024 بأكملها)
        # -----------------------------------------------------------------------------------
        
        # الإشارات (SIGNAL_ALERT)
        neigh_activity_df = pd.read_sql(f"SELECT city, neighborhood, COUNT(*) as c, SUM(price) as v FROM {TABLE_NAME} WHERE year=2024 GROUP BY city, neighborhood HAVING c > 1000 ORDER BY c DESC LIMIT 3", engine)
        for i, row in neigh_activity_df.iterrows():
            posts.append({
                "id": f"p_sig_{i}", "contentType": "signal_alert", "title": f"إشارة تداول نشطة طوال العام في {row['neighborhood']}",
                "author": {"name": "خوارزمية الرصد", "role": "AI Alert", "verified": True}, "timestamp": now, "tags": [row['city'], "الأحياء الأكثر نشاطا"],
                "engagement": {"likes": 340 + i*10, "shares": 120 + i*5, "saves": 50 + i*2},
                "payload": {"delta": f"نشاط بلغ {row['c']} صفقة", "isPositive": True, "context": f"رصدنا إقبالاً مستمراً على عقارات حي {row['neighborhood']} في {row['city']}، بإجمالي سيولة بلغت {format_money(row['v'])} خلال كامل عام 2024.", "alertLevel": "high"}
            })

        # أقوى 5 مدن
        top_cities_df = pd.read_sql(f"SELECT city, SUM(price) as v, COUNT(*) as c FROM {TABLE_NAME} WHERE year=2024 GROUP BY city ORDER BY v DESC LIMIT 5", engine)
        for i, row in top_cities_df.iterrows():
            posts.append({
                "id": f"p_pulse_{i}", "contentType": "market_pulse", "title": f"حرارة السوق 2024: الزخم في {row['city']}",
                "author": {"name": "رادار المستثمر", "role": "تحليل", "verified": True}, "timestamp": now, "tags": [row['city'], "سيولة المدن"],
                "engagement": {"likes": 500 - i*20, "shares": 160 - i*10, "saves": 200},
                "payload": {"sector": "القطاع العقاري", "status": "hot", "score": 98 - i, "summary": f"الطلب المرتفع مستمر، حيث قادت {row['city']} حركة التداول السنوية محققة {format_money(row['v'])} موزعة على {row['c']} صفقة عقارية مسجلة إلكترونياً."}
            })

        # مقارنات (COMPARISON)
        top_city = top_cities_df.iloc[0]['city'] if not top_cities_df.empty else 'الرياض'
        comp_df = pd.read_sql(f"SELECT property_type, SUM(price) as v FROM {TABLE_NAME} WHERE city='{top_city}' AND year=2024 GROUP BY property_type ORDER BY v DESC LIMIT 2", engine)
        if len(comp_df) >= 2:
            posts.append({
                "id": "p_comp_1", "contentType": "comparison", "title": f"مقارنة القطاعات لعام 2024 في {top_city}",
                "author": {"name": "التحليل الإحصائي", "role": "المدن", "verified": True}, "timestamp": now, "tags": ["سكني", "تجاري", top_city],
                "engagement": {"likes": 400, "shares": 150, "saves": 320},
                "payload": {
                    "itemA": {"label": f"قطاع {comp_df.iloc[0]['property_type']}", "value": format_money(comp_df.iloc[0]['v']), "subtext": "السيولة السنوية"},
                    "itemB": {"label": f"قطاع {comp_df.iloc[1]['property_type']}", "value": format_money(comp_df.iloc[1]['v']), "subtext": "السيولة السنوية"},
                    "conclusion": f"القطاع {comp_df.iloc[0]['property_type']} يسيطر تماماً على حصة الأسد في تداولات {top_city} مقارنة بنظيره التجاري."
                }
            })

        # محافظ (PORTFOLIO)
        posts.append({
            "id": "p_port_1", "contentType": "portfolio", "title": "محفظة الاستقرار السكني المعتمدة من AI",
            "author": {"name": "خبير المحافظ", "role": "استراتيجيات", "verified": True}, "timestamp": now, "tags": ["محفظة آمنة", "عائد ثابت"],
            "engagement": {"likes": 320, "shares": 105, "saves": 400},
            "payload": {
                "expectedReturn": 7.5,
                "assets": [{"name": f"عقارات في {top_cities_df.iloc[0]['city'] if len(top_cities_df)>0 else 'الرياض'}", "value": 50, "color": "blue"}, {"name": f"عقارات في {top_cities_df.iloc[1]['city'] if len(top_cities_df)>1 else 'جدة'}", "value": 30, "color": "purple"}, {"name": "صناديق ريت سكنية", "value": 20, "color": "green"}]
            }
        })

        # حقائق (FACT)
        max_df = pd.read_sql(f"SELECT price, city, neighborhood, property_type FROM {TABLE_NAME} WHERE year=2024 ORDER BY price DESC LIMIT 3", engine)
        for i, row in max_df.iterrows():
            posts.append({
                "id": f"p_fact_{i}", "contentType": "fact", "title": "حقائق وأرقام قياسية خلال 2024",
                "author": {"name": "فريق الرصد", "role": "بيانات", "verified": False}, "timestamp": now, "tags": ["صفقات كبرى", row['city']],
                "engagement": {"likes": 800 - i*50, "shares": 120, "saves": 90},
                "payload": {
                    "fact": f"إحدى أضخم صفقات عام 2024 للعقار من نوع '{row['property_type']}' تمت في حي {row['neighborhood']} بمدينة {row['city']}.",
                    "highlight": format_money(row['price']),
                    "source": "الصفقات العقارية الرسمية المفتوحة"
                }
            })

        # عاجل (BREAKING_NEWS)
        total_p = top_cities_df['v'].sum()
        total_c = top_cities_df['c'].sum()
        posts.append({
            "id": "p_news_1", "contentType": "breaking_news", "title": f"عاجل: السوق يخترق حاجز {format_money(total_p)} في 2024",
            "author": {"name": "مؤشر رادار", "role": "اقتصاد", "verified": True}, "timestamp": now, "tags": ["أخبار 2024", "العام"],
            "engagement": {"likes": 1500, "shares": 900, "saves": 200},
            "payload": {
                "headline": f"تجاوز أعداد الصفقات لـ {total_c} عبر المدن الرئيسية",
                "summary": f"عام 2024 يشهد ضخاً هائلاً للسيولة يعيد تشكيل خريطة الأسعار، حيث حقق التداول السنوي مستويات غير مسبوقة."
            }
        })
        
        # -----------------------------------------------------------------------------------
        # 2. المنشورات التفاعلية والاتجاهات (Trends & Dashboards) المُضافة هنا !!
        # -----------------------------------------------------------------------------------
        
        # WIDGET - الاتجاه السنوي لحجم السيولة (Trend Line) عبر الأرباع الأربعة
        trend_df = pd.read_sql(f"SELECT quarter, SUM(price) as v FROM {TABLE_NAME} WHERE year=2024 GROUP BY quarter ORDER BY quarter", engine)
        trend_data = []
        for _, r in trend_df.iterrows():
            trend_data.append({"name": r['quarter'], "value": float(r['v']) / 1e9})  # القيمة بالمليارات لتسهيل العرض
            
        posts.append({
            "id": "p_widget_trend", "contentType": "widget", "title": "مسار السيولة الربعي لعام 2024 (بالمليار ريال)",
            "author": {"name": "محرك الرسوم", "role": "رسوم بيانية", "verified": True}, "timestamp": now, "tags": ["Trend", "Line Chart", "2024"],
            "engagement": {"likes": 840, "shares": 310, "saves": 500},
            "payload": {
                "widgetData": {
                    "id": "w_trend_2024",
                    "title": "اتجاه حجم تداول القطاع العقاري طوال 2024",
                    "type": "line",
                    "description": "يوضح الرسم البياني كيف تدرجت السيولة (بالمليار ريال) منذ الربع الأول وحتى الربع الرابع.",
                    "data": trend_data
                }
            }
        })
        
        # WIDGET - الاتجاه الربعي لعدد الصفقات (Bar Chart)
        trend_count_df = pd.read_sql(f"SELECT quarter, COUNT(*) as c FROM {TABLE_NAME} WHERE year=2024 GROUP BY quarter ORDER BY quarter", engine)
        count_data = []
        for _, r in trend_count_df.iterrows():
            count_data.append({"name": r['quarter'], "value": int(r['c'])})
            
        posts.append({
            "id": "p_widget_bar", "contentType": "widget", "title": "عدد الصفقات في كل ربع (2024)",
            "author": {"name": "محرك الرسوم", "role": "رسوم بيانية", "verified": True}, "timestamp": now, "tags": ["Trend", "Bar Chart", "Volume"],
            "engagement": {"likes": 650, "shares": 220, "saves": 400},
            "payload": {
                "widgetData": {
                    "id": "w_bar_2024",
                    "title": "أحجام الصفقات ربع السنوية",
                    "type": "bar",
                    "description": "يوضح عدد العمليات والصفقات العقارية المتممة بنجاح في كل ربع من أرباع 2024.",
                    "data": count_data
                }
            }
        })
        
        # EXPERT_INSIGHT - حول تحليل الترند
        best_quarter = trend_df.iloc[trend_df['v'].argmax()]['quarter'] if not trend_df.empty else "Q4"
        posts.append({
            "id": "p_exp_trend", "contentType": "expert_insight", "title": "خبراء رادار: النمط السنوي الواضح",
            "author": {"name": "أبحاث رادار", "role": "رصد الفصول", "verified": True}, "timestamp": now, "tags": ["Expert", "ترند مقروء"],
            "engagement": {"likes": 400, "shares": 150, "saves": 250},
            "payload": {
                "quote": f"من المثير للاهتمام رؤية كيف كان الربع {best_quarter} هو ذروة السيولة في عام 2024. هذا النمط يعطينا فكرة دقيقة عن مواسم الطرح والطلب للمستثمرين.",
                "expertName": "فريق أبحاث رادار", "expertRole": "شعبة البيانات الديموغرافية",
                "expertImage": "https://ui-avatars.com/api/?name=Research&background=10b981&color=fff"
            }
        })

        # WEEKLY_SNAPSHOT أو هنا (QUARTERLY SNAPSHOT) - ملخص عام كامل
        posts.append({
            "id": "p_snapshot_2024", "contentType": "weekly_snapshot", "title": "الملخص الاقتصادي الشامل (2024)",
            "author": {"name": "التأريخ الاقتصادي", "role": "بانوراما", "verified": True}, "timestamp": now, "tags": ["ملخص العام", "Annual"],
            "engagement": {"likes": 1200, "shares": 650, "saves": 900},
            "payload": {
                "highlights": [
                    {"label": "أعلى ربع بالسيولة", "value": f"الربع {best_quarter}"},
                    {"label": "أعلى مدن التداول", "value": f"{top_city}"},
                    {"label": "إجمالي صفقات العام", "value": f"{total_c} صفقة مسجلة"}
                ]
            }
        })

        # ARTICLE - مقال متكامل عن اتجاه عام 2024
        posts.append({
            "id": "p_art_trend", "contentType": "article", "title": f"قراءة في حصاد عام 2024: أين اتجهت المليارات؟",
            "author": {"name": "د. عقاري", "role": "محلل استراتيجي", "verified": True}, "timestamp": now, "tags": ["حصاد 2024", "مقالات طويلة"],
            "engagement": {"likes": 950, "shares": 300, "saves": 600},
            "payload": {
                "excerpt": f"لقد برهنت أرصدة عام 2024 المتتابعة عبر الأرباع الأربعة أن المشهد العقاري لم يكتفِ بنجاحات {top_city} فحسب، بل شهدنا تصاعداً استثمارياً كبيراً بحصاد تعدّى نطاقات التوقعات. دعونا نحلل الخط البياني الطويل...",
                "readTime": "8 دقائق", 
                "imageUrl": "https://images.unsplash.com/photo-1542435503-956c469947f6?auto=format&fit=crop&w=800&q=80"
            }
        })

        # -----------------------------------------------------------------------------------
        # 3. المنشورات التثقيفية والنقاشية (المستعادة بناء على الطلب)
        # -----------------------------------------------------------------------------------
        
        # DASHBOARD - لوحة البيانات التفاعلية لمنطقة ذروة التداول
        posts.append({
            "id": "p_dash_deep1", "contentType": "dashboard", "title": f"لوحات تفاعلية للسيولة في {top_city}",
            "author": {"name": "قسم البيانات", "role": "إحصاء", "verified": True}, "timestamp": now, "tags": ["Dashboard", "لوحات 2024"],
            "engagement": {"likes": 320, "shares": 50, "saves": 900},
            "payload": {"dashboardId": f"dash_{top_city}_2024_full", "widgetCount": 8, "views": 25000, "previewImage": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80"}
        })

        # POLL - تصويت وتوقع مبني على تحليل السنة
        posts.append({
            "id": "p_poll_1", "contentType": "poll", "title": "توقعات 2025: إلى أين نتجه؟",
            "author": {"name": "رادار البيانات", "role": "تفاعل", "verified": True}, "timestamp": now, "tags": ["توقعات", "استطلاع"],
            "engagement": {"likes": 1240, "shares": 300, "saves": 150},
            "payload": {
                "totalVotes": 7200,
                "options": [
                    {"label": f"استمرار صدارة {top_city}", "percentage": 48},
                    {"label": f"صعود مدينة {top_cities_df.iloc[1]['city'] if len(top_cities_df)>1 else 'جدة'}", "percentage": 32},
                    {"label": "تراجع السيولة بشكل عام", "percentage": 20}
                ]
            }
        })

        # EVENT - حدث عقاري مستوحى من نشاط العام
        posts.append({
            "id": "p_event_1", "contentType": "event", "title": f"ملتقى الاستثمار السنوي في {top_city}",
            "author": {"name": "غرفة التجارة", "role": "منظم", "verified": True}, "timestamp": now, "tags": ["Event", "مؤتمرات"],
            "engagement": {"likes": 250, "shares": 75, "saves": 300},
            "payload": {
                "eventName": "المعرض العقاري الشامل (نسخة التتويج)",
                "month": "NOV", "day": "22", "time": "09:00 AM",
                "location": f"قاعة المؤتمرات الكبرى بـ {top_city}", "isOnline": False
            }
        })

        # TERMINOLOGY - مصطلحات العقار
        posts.append({
            "id": "p_term_1", "contentType": "terminology", "title": "مصطلح: حجم التداول الكلي (Volume)",
            "author": {"name": "أكاديمية العقار", "role": "تعليم", "verified": True}, "timestamp": now, "tags": ["تعليم", "مصطلحات"],
            "engagement": {"likes": 400, "shares": 50, "saves": 500},
            "payload": {
                "term": "حجم التداول العقاري",
                "definition": "هو القيمة الإجمالية لجميع الصفقات والمبالغ المتداولة لبيع وشراء العقارات خلال فترة زمنية محددة. في عام 2024 لوحده رأينا أرقاما غير مسبوقة.",
                "difficulty": "Easy"
            }
        })

        # Q_AND_A - نقاشات مجتمع رادار
        posts.append({
            "id": "p_qa_1", "contentType": "q_and_a", "title": f"سؤال: هل تفضل الاستثمار في {top_city} أم التوجه للأطراف؟",
            "author": {"name": "مجتمع رادار", "role": "نقاش", "verified": False}, "timestamp": now, "tags": ["Q&A", "استثمار"],
            "engagement": {"likes": 85, "shares": 25, "saves": 45},
            "payload": {
                "question": f"مع وصول الصفقات إلى مستويات تاريخية في {top_city}، هل الأسعار ما تزال مشجعة للشراء أم الأفضل البحث عن مدن نامية أخرى؟",
                "answer": f"بالرغم من الأسعار القوية، الدعم الحكومي ومشاريع البنية التحتية في {top_city} يجعلها ملاذاً آمناً طويل الأجل، بينما تمثل المدن الأخرى فرص نمو متسارعة الخطى.",
                "expertAvatar": "https://i.pravatar.cc/150?u=expert3"
            }
        })

        # CHECKLIST - مهام للمشتري
        posts.append({
            "id": "p_check_1", "contentType": "checklist", "title": "قائمة المراجعة: قبل دخول سوق 2025",
            "author": {"name": "نصائح رادار", "role": "مستشار رقمي", "verified": True}, "timestamp": now, "tags": ["Checklist", "القانون"],
            "engagement": {"likes": 650, "shares": 190, "saves": 820},
            "payload": {
                "listTitle": "أشياء يجب القيام بها قبل اتخاذ قرار الشراء",
                "items": [
                    {"text": f"مراجعة تقرير السيولة لعام 2024 لمدينة {top_city}", "checked": True},
                    {"text": "التحقق من صحة الرقم المرجعي للصكوك", "checked": False},
                    {"text": "مقارنة السعر بمتوسط الحي خلال الربع الأخير القوي", "checked": False},
                    {"text": "دراسة العائد التأجيري التجاري vs السكني", "checked": False}
                ]
            }
        })

    except Exception as e:
        print(f"❌ خطأ أثناء توليد المنشورات الذكية: {e}")

    # حفظ JSON
    with open(OUTPUT_JSON, 'w', encoding='utf-8') as f:
        json.dump(posts, f, ensure_ascii=False, indent=2)
        
    print(f"🎉 تم مسح البيانات، وتوليد {len(posts)} منشوراً تفصيلياً (يشمل اتجاهات الترند Trend Lines لعام 2024 بالكامل) تم حفظها بملف {OUTPUT_JSON}.")

# ==========================================
# تشغيل السكريبت
# ==========================================
if __name__ == "__main__":
    print("==================================================")
    print("🚀 بدء تحميل كافة بيانات أرباع 2024 وتوليد ترنداتها")
    print("==================================================")
    
    upload_success = upload_excel_files_to_mysql()
    if upload_success:
        generate_posts_from_db()
