"""
==========================================================
 generate_dashboard_charts.py
 محرك بيانات ECharts المتقدم – يستخرج 10+ تحليلات عقارية
 من MySQL ويحفظها في data/dashboard_charts.json
==========================================================
"""
import json
import pandas as pd
import numpy as np
from db_connection import get_engine
from sqlalchemy import text

OUTPUT_PATH = "../data/dashboard_charts.json"

def run_query(engine, sql):
    """تشغيل استعلام SQL وإرجاع DataFrame"""
    with engine.connect() as conn:
        return pd.read_sql(text(sql), conn)

def safe_float(val):
    """تحويل آمن للأرقام"""
    if val is None or (isinstance(val, float) and np.isnan(val)):
        return 0.0
    return round(float(val), 2)

def generate():
    engine = get_engine()
    result = {}

    print("📊 [1/10] مسار السيولة الربعي مع الربع السابق...")
    df = run_query(engine, """
        SELECT quarter,
               SUM(price) as total_price,
               COUNT(*) as txn_count,
               AVG(price) as avg_price,
               SUM(area) as total_area
        FROM real_estate_transactions
        WHERE year = 2024 AND price > 0
        GROUP BY quarter ORDER BY quarter
    """)
    result["quarterlyTrend"] = {
        "categories": df["quarter"].tolist(),
        "liquidity_B": [safe_float(x / 1e9) for x in df["total_price"]],
        "txn_count":   df["txn_count"].tolist(),
        "avg_price_M": [safe_float(x / 1e6) for x in df["avg_price"]],
        "total_area_M": [safe_float(x / 1e6) for x in df["total_area"]],
    }

    print("📊 [2/10] أفضل 8 مناطق متعدد الأبعاد...")
    df = run_query(engine, """
        SELECT region,
               SUM(price) as total_price,
               COUNT(*) as txn_count,
               AVG(price) as avg_price,
               AVG(area) as avg_area,
               SUM(area) as total_area
        FROM real_estate_transactions
        WHERE year = 2024 AND price > 0 AND region IS NOT NULL
        GROUP BY region
        ORDER BY total_price DESC LIMIT 8
    """)
    result["regionMulti"] = {
        "regions":    df["region"].tolist(),
        "price_B":    [safe_float(x / 1e9) for x in df["total_price"]],
        "count":      df["txn_count"].tolist(),
        "avg_price_M":[safe_float(x / 1e6) for x in df["avg_price"]],
        "avg_area_M": [safe_float(x / 1000) for x in df["avg_area"]],
    }

    print("📊 [3/10] توزيع فئات العقارات مع نسبة السيولة...")
    df = run_query(engine, """
        SELECT property_type,
               COUNT(*) as txn_count,
               SUM(price) as total_price,
               AVG(price) as avg_price
        FROM real_estate_transactions
        WHERE year = 2024 AND price > 0 AND property_type IS NOT NULL
        GROUP BY property_type
        ORDER BY total_price DESC
    """)
    total_price_all = df["total_price"].sum()
    result["propertyTypes"] = [
        {
            "name": r["property_type"],
            "count": int(r["txn_count"]),
            "total_B": safe_float(r["total_price"] / 1e9),
            "avg_M": safe_float(r["avg_price"] / 1e6),
            "pct": safe_float(r["total_price"] / total_price_all * 100)
        }
        for _, r in df.iterrows()
    ]

    print("📊 [4/10] راداركارت مقارنة أداء المناطق الكبرى...")
    df = run_query(engine, """
        SELECT region,
               AVG(price) as avg_price,
               COUNT(*) as txn_count,
               AVG(area) as avg_area,
               SUM(price)/NULLIF(SUM(area),0) as price_per_sqm
        FROM real_estate_transactions
        WHERE year = 2024 AND price > 0 AND area > 0
              AND region IN (
                  'منطقة الرياض','منطقة مكة المكرمه',
                  'منطقة الشرقية','منطقة المدينة المنوره',
                  'منطقة القصيم'
              )
        GROUP BY region
    """)
    if not df.empty:
        cols = ["avg_price", "txn_count", "avg_area", "price_per_sqm"]
        for c in cols:
            df[c] = pd.to_numeric(df[c], errors="coerce").fillna(0)
        df_norm = df.copy()
        for c in cols:
            mx = df[c].max()
            df_norm[c] = (df[c] / mx * 100).round(1) if mx > 0 else 0
        result["radarRegions"] = {
            "indicators": [
                {"name": "متوسط السعر",    "max": 100},
                {"name": "عدد الصفقات",    "max": 100},
                {"name": "متوسط المساحة",  "max": 100},
                {"name": "سعر المتر",      "max": 100},
            ],
            "series": [
                {
                    "name": row["region"],
                    "value": [
                        safe_float(df_norm.loc[idx, "avg_price"]),
                        safe_float(df_norm.loc[idx, "txn_count"]),
                        safe_float(df_norm.loc[idx, "avg_area"]),
                        safe_float(df_norm.loc[idx, "price_per_sqm"]),
                    ]
                }
                for idx, row in df.iterrows()
            ]
        }
    else:
        result["radarRegions"] = {"indicators": [], "series": []}

    print("📊 [5/10] Heatmap: المنطقة × النوع (كثافة الصفقات)...")
    df = run_query(engine, """
        SELECT region, property_type, COUNT(*) as cnt
        FROM real_estate_transactions
        WHERE year = 2024
              AND region IN (
                  'منطقة الرياض','منطقة مكة المكرمه',
                  'منطقة الشرقية','منطقة المدينة المنوره',
                  'منطقة القصيم','منطقة عسير','منطقة حائل'
              )
              AND property_type IS NOT NULL
        GROUP BY region, property_type
    """)
    regions = sorted(df["region"].unique().tolist())
    ptypes  = sorted(df["property_type"].unique().tolist())
    heat_data = []
    for r_i, reg in enumerate(regions):
        for t_i, typ in enumerate(ptypes):
            row = df[(df["region"] == reg) & (df["property_type"] == typ)]
            val = int(row["cnt"].sum()) if not row.empty else 0
            heat_data.append([r_i, t_i, val])
    result["heatmap"] = {"xaxis": regions, "yaxis": ptypes, "data": heat_data}

    print("📊 [6/10] Scatter: مساحة vs سعر مع تلوين حسب النوع...")
    df = run_query(engine, """
        SELECT area, price, property_type
        FROM real_estate_transactions
        WHERE year = 2024 AND price > 1e5 AND area BETWEEN 50 AND 5000
              AND price < 50000000
        ORDER BY RAND() LIMIT 300
    """)
    scatter_by_type = {}
    for ptype, grp in df.groupby("property_type"):
        scatter_by_type[str(ptype)] = [
            [safe_float(r["area"]), safe_float(r["price"] / 1e6)]
            for _, r in grp.iterrows()
        ]
    result["scatter"] = scatter_by_type

    print("📊 [7/10] مسار السيولة الشهري (Trend Line)...")
    df = run_query(engine, """
        SELECT
          CASE quarter
            WHEN 'Q1' THEN CONCAT('يناير ',year)
            WHEN 'Q2' THEN CONCAT('أبريل ',year)
            WHEN 'Q3' THEN CONCAT('يوليو ',year)
            WHEN 'Q4' THEN CONCAT('أكتوبر ',year)
          END as period,
          quarter,
          SUM(price) as total_price,
          COUNT(*) as txn_count,
          MAX(price) as max_price
        FROM real_estate_transactions
        WHERE year = 2024 AND price > 0
        GROUP BY quarter, year ORDER BY quarter
    """)
    result["liquidityTrend"] = {
        "periods":   df["period"].tolist(),
        "total_B":   [safe_float(x / 1e9) for x in df["total_price"]],
        "count":     df["txn_count"].tolist(),
        "max_M":     [safe_float(x / 1e6) for x in df["max_price"]],
    }

    print("📊 [8/10] مقارنة الربعين الأول والأخير (Column)...")
    df = run_query(engine, """
        SELECT region,
               SUM(CASE WHEN quarter='Q1' THEN price ELSE 0 END) / 1e9 as q1_price,
               SUM(CASE WHEN quarter='Q4' THEN price ELSE 0 END) / 1e9 as q4_price,
               COUNT(CASE WHEN quarter='Q1' THEN 1 END) as q1_count,
               COUNT(CASE WHEN quarter='Q4' THEN 1 END) as q4_count
        FROM real_estate_transactions
        WHERE year = 2024 AND price > 0
        GROUP BY region
        ORDER BY (SUM(CASE WHEN quarter='Q1' THEN price ELSE 0 END) + SUM(CASE WHEN quarter='Q4' THEN price ELSE 0 END)) DESC LIMIT 6
    """)
    result["qComparison"] = {
        "regions": df["region"].tolist(),
        "q1_B": [safe_float(x) for x in df["q1_price"]],
        "q4_B": [safe_float(x) for x in df["q4_price"]],
        "q1_count": df["q1_count"].tolist(),
        "q4_count": df["q4_count"].tolist(),
    }

    print("📊 [9/10] توزيع نطاقات الأسعار (Price Segmentation)...")
    df = run_query(engine, """
        SELECT
          CASE
            WHEN price < 500000   THEN 'أقل من 500K'
            WHEN price < 1000000  THEN '500K - 1M'
            WHEN price < 3000000  THEN '1M - 3M'
            WHEN price < 5000000  THEN '3M - 5M'
            WHEN price < 10000000 THEN '5M - 10M'
            ELSE 'أكثر من 10M'
          END as price_range,
          COUNT(*) as cnt,
          SUM(price) as total
        FROM real_estate_transactions
        WHERE year = 2024 AND price > 0
        GROUP BY price_range
        ORDER BY MIN(price)
    """)
    result["priceRanges"] = [
        {"name": r["price_range"], "value": int(r["cnt"]), "total_B": safe_float(r["total"] / 1e9)}
        for _, r in df.iterrows()
    ]

    print("📊 [10/10] أعلى المدن حجماً (Bubble / Bar)...")
    df = run_query(engine, """
        SELECT city,
               COUNT(*) as txn_count,
               SUM(price) as total_price,
               AVG(price) as avg_price
        FROM real_estate_transactions
        WHERE year = 2024 AND price > 0 AND city IS NOT NULL
        GROUP BY city
        ORDER BY total_price DESC LIMIT 10
    """)
    result["topCities"] = {
        "cities": df["city"].tolist(),
        "total_B": [safe_float(x / 1e9) for x in df["total_price"]],
        "count":   df["txn_count"].tolist(),
        "avg_M":   [safe_float(x / 1e6) for x in df["avg_price"]],
    }

    # KPI Summary
    df_kpi = run_query(engine, """
        SELECT
          COUNT(*) as total_txn,
          SUM(price) as total_price,
          AVG(price) as avg_price,
          MAX(price) as max_price,
          SUM(area) as total_area,
          AVG(area) as avg_area,
          SUM(price)/NULLIF(SUM(area),0) as price_per_sqm
        FROM real_estate_transactions
        WHERE year = 2024 AND price > 0 AND area > 0
    """)
    r = df_kpi.iloc[0]
    result["kpi"] = {
        "total_txn":      int(r["total_txn"]),
        "total_price_B":  safe_float(r["total_price"] / 1e9),
        "avg_price_M":    safe_float(r["avg_price"] / 1e6),
        "max_price_M":    safe_float(r["max_price"] / 1e6),
        "avg_area":       safe_float(r["avg_area"]),
        "price_per_sqm":  safe_float(r["price_per_sqm"]),
    }

    with open(OUTPUT_PATH, "w", encoding="utf-8") as f:
        json.dump(result, f, ensure_ascii=False, indent=2)

    print(f"\n✅ تم حفظ {len(result)} مجموعة تحليلية في: {OUTPUT_PATH}")

if __name__ == "__main__":
    generate()
