"""
db_connection.py
----------------
إعدادات الاتصال بقاعدة بيانات MySQL عبر XAMPP
"""

import mysql.connector
from sqlalchemy import create_engine

# ═══════════════════════════════════════════
#   إعدادات الاتصال (XAMPP defaults)
# ═══════════════════════════════════════════
DB_CONFIG = {
    "host":     "localhost",
    "port":     3306,
    "user":     "root",
    "password": "",          # XAMPP افتراضياً بدون كلمة مرور
    "database": "radar_db",
    "charset":  "utf8mb4",   # مهم لدعم العربية
}


def get_connection():
    """إرجاع اتصال مباشر بـ MySQL"""
    conn = mysql.connector.connect(**DB_CONFIG)
    return conn


def get_engine():
    """إرجاع SQLAlchemy engine (للاستخدام مع pandas)"""
    url = (
        f"mysql+pymysql://{DB_CONFIG['user']}:{DB_CONFIG['password']}"
        f"@{DB_CONFIG['host']}:{DB_CONFIG['port']}"
        f"/{DB_CONFIG['database']}?charset={DB_CONFIG['charset']}"
    )
    engine = create_engine(url, echo=False)
    return engine


# ═══════════════════════════════════════════
#   اختبار الاتصال
# ═══════════════════════════════════════════
if __name__ == "__main__":
    try:
        conn = get_connection()
        if conn.is_connected():
            info = conn.get_server_info()
            print(f"✅ تم الاتصال بنجاح! MySQL version: {info}")
            cursor = conn.cursor()
            cursor.execute("SELECT DATABASE();")
            db = cursor.fetchone()
            print(f"📦 قاعدة البيانات الحالية: {db[0]}")
            cursor.close()
            conn.close()
    except mysql.connector.Error as e:
        print(f"❌ فشل الاتصال: {e}")
        print("\n💡 تأكد من:")
        print("   1. XAMPP مفتوح و MySQL شغّال (لون أخضر)")
        print("   2. قاعدة البيانات 'radar_db' موجودة في phpMyAdmin")
        print("   3. إعدادات DB_CONFIG صحيحة أعلاه")
