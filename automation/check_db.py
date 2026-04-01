from db_connection import get_engine
import pandas as pd

engine = get_engine()
try:
    df = pd.read_sql('SELECT year, quarter, COUNT(*) as "عدد الأسطر (الصفقات)" FROM real_estate_transactions GROUP BY year, quarter', engine)
    print("📋 محتويات قاعدة البيانات الحالية:")
    print(df.to_markdown(index=False))
    
    total = pd.read_sql('SELECT COUNT(*) as t FROM real_estate_transactions', engine)
    print(f"\nإجمالي الأسطر في كامل القاعدة: {total['t'].iloc[0]}")
except Exception as e:
    print(f"Error: {e}")
