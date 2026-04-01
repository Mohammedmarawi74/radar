import json

def generate_arabic_text_summary():
    json_path = "../data/radar_posts.json"
    txt_path = "../data/ملخص_المنشورات.txt"
    
    with open(json_path, 'r', encoding='utf-8') as f:
        posts = json.load(f)
        
    with open(txt_path, 'w', encoding='utf-8') as file:
        file.write("========================================================\n")
        file.write("📄 ملخص محتويات ملف (radar_posts.json) باللغة العربية\n")
        file.write("========================================================\n\n")
        file.write(f"📊 الإجمالي: {len(posts)} منشوراً ذكياً تم توليده.\n\n")
        file.write("-" * 50 + "\n\n")
        
        for idx, p in enumerate(posts, 1):
            ctype = p.get('contentType', 'غير محدد')
            title = p.get('title', 'بدون عنوان')
            author = p.get('author', {}).get('name', 'مجهول')
            
            file.write(f"🟢 رقم المنشور: {idx}\n")
            file.write(f"📌 نوع المنشور: {ctype}\n")
            file.write(f"📝 العنوان   : {title}\n")
            file.write(f"👤 المصدر    : {author}\n")
            
            # استخراج ملخص عن الداتا الموجودة بناء على النوع
            payload = p.get('payload', {})
            file.write("💡 محتوى المنشور والتفاصيل:\n")
            
            if ctype == 'market_pulse':
                file.write(f"   - رسالة السوق: {payload.get('summary')}\n")
            elif ctype == 'signal_alert':
                file.write(f"   - الحدث والنشاط (التنبيه): {payload.get('context')}\n")
            elif ctype == 'fact':
                file.write(f"   - الحقيقة المسجلة: {payload.get('fact')}\n")
                file.write(f"   - الرقم الصادم: {payload.get('highlight')}\n")
            elif ctype == 'widget':
                w_data = payload.get('widgetData', {})
                file.write(f"   - اللوحة البيانية: {w_data.get('title')} ({w_data.get('type')})\n")
                file.write("   - تفاصيل الاتجاه للـ 4 أرباع:\n")
                for item in w_data.get('data', []):
                    file.write(f"       • الربع {item.get('name')}: {item.get('value')}\n")
            elif ctype == 'comparison':
                file.write(f"   - الطرف الأول: {payload.get('itemA', {}).get('label')} ({payload.get('itemA', {}).get('value')})\n")
                file.write(f"   - الطرف الثاني: {payload.get('itemB', {}).get('label')} ({payload.get('itemB', {}).get('value')})\n")
                file.write(f"   - الخلاصة الحاسمة: {payload.get('conclusion')}\n")
            elif ctype == 'portfolio':
                file.write(f"   - العائد المتوقع للمحفظة: {payload.get('expectedReturn')}%\n")
                file.write("   - مكونات المحفظة المقترحة:\n")
                for asset in payload.get('assets', []):
                    file.write(f"       • العقار/الاسم: {asset.get('name')} بنسبة {asset.get('value')}%\n")
            elif ctype == 'breaking_news':
                file.write(f"   - الخبر العاجل: {payload.get('headline')}\n")
                file.write(f"   - التفاصيل: {payload.get('summary')}\n")
            elif ctype == 'expert_insight':
                file.write(f"   - رأي الخبير: '{payload.get('quote')}'\n")
                file.write(f"   - بلسان: {payload.get('expertName')}\n")
            elif ctype == 'weekly_snapshot':
                file.write("   - أبرز التلخيصات لعام 2024:\n")
                for hl in payload.get('highlights', []):
                    file.write(f"       • {hl.get('label')}: {hl.get('value')}\n")
            elif ctype == 'article':
                file.write(f"   - مقتطف المقال التحليلي: {payload.get('excerpt')}\n")
            elif ctype == 'dashboard':
                file.write(f"   - تحوّل إلى شاشة: {payload.get('dashboardId')}\n")
            elif ctype == 'poll':
                file.write(f"   - الأصوات المشتركة: {payload.get('totalVotes')} تصويت\n")
                file.write("   - خيارات التصويت للعام القادم:\n")
                for op in payload.get('options', []):
                    file.write(f"       • أؤيد {op.get('label')} بنسبة ({op.get('percentage')}%)\n")
            elif ctype == 'event':
                file.write(f"   - الحدث العقاري المرتقب: {payload.get('eventName')}\n")
                file.write(f"   - مكان وموعد المعرض: {payload.get('location')} - يوم {payload.get('day')} {payload.get('month')}\n")
            elif ctype == 'terminology':
                file.write(f"   - المصطلح المشروح: {payload.get('term')}\n")
                file.write(f"   - التعريف: {payload.get('definition')}\n")
            elif ctype == 'q_and_a':
                file.write(f"   - السؤال الاستثماري: {payload.get('question')}\n")
                file.write(f"   - الإجابة الاستراتيجية: {payload.get('answer')}\n")
            elif ctype == 'checklist':
                file.write(f"   - عنوان القائمة: {payload.get('listTitle')}\n")
                file.write("   - المهام المطلوبة:\n")
                for item in payload.get('items', []):
                    ch = "✅" if item.get('checked') else "🔲"
                    file.write(f"       {ch} {item.get('text')}\n")
            
            file.write("\n" + "-" * 50 + "\n\n")

    print(f"تم إنشاء ملف النص بنجاح: {txt_path}")

if __name__ == "__main__":
    generate_arabic_text_summary()
