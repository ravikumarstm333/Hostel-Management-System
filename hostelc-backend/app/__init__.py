from flask import Flask
from .extensions import mongo, jwt, cors, bcrypt
from .config import Config

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    # Initialize Extensions
    mongo.init_app(app)
    jwt.init_app(app)
    cors.init_app(app)
    bcrypt.init_app(app)

    # Startup Logs and MongoDB Connection Check
    print("========================================")
    print("🚀 HOSTELC Backend Starting...")
    print("========================================")
    print("✅ Flask App Initialized")

    try:
        with app.app_context():
            # Verify connection using ping command
            mongo.db.command("ping")
            print("✅ MongoDB Connected Successfully")
            print(f"📦 Database: {mongo.db.name}")
            if app.config.get('MONGO_URI') and "mongodb+srv://" in app.config.get('MONGO_URI'):
                print("🔗 MongoDB Atlas Connected")
    except Exception as e:
        print(f"❌ MongoDB Connection Failed: {str(e)}")

    # Mask sensitive credentials in URI for display
    uri = app.config.get('MONGO_URI')
    if uri:
        masked_uri = uri
        if "@" in uri:
            try:
                protocol = uri.split("://")[0]
                masked_uri = f"{protocol}://****:****@{uri.split('@')[-1]}"
            except: masked_uri = "mongodb://****:****@masked"
        print(f"🔗 Masked URI: {masked_uri}")
    else:
        print("🔗 MongoDB URI: NOT CONFIGURED IN .env")

    print("🌐 Server Running On: http://127.0.0.1:5000")
    print("========================================")

    # Register Blueprints
    from .routes.auth import auth_bp
    from .routes.student import student_bp
    from .routes.warden import warden_bp
    from .routes.technician import technician_bp
    from .routes.complaints import complaints_bp
    from .routes.gatepasses import gatepasses_bp
    from .routes.notices import notices_bp
    from .routes.emergencies import emergencies_bp
    from .routes.fees import fees_bp
    from .routes.mess import mess_bp

    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(student_bp, url_prefix='/api/student')
    app.register_blueprint(warden_bp, url_prefix='/api/warden')
    app.register_blueprint(technician_bp, url_prefix='/api/technician')
    app.register_blueprint(complaints_bp, url_prefix='/api/complaints')
    app.register_blueprint(gatepasses_bp, url_prefix='/api/gatepasses')
    app.register_blueprint(notices_bp, url_prefix='/api/notices')
    app.register_blueprint(emergencies_bp, url_prefix='/api/emergencies')
    app.register_blueprint(fees_bp, url_prefix='/api/fees')
    app.register_blueprint(mess_bp, url_prefix='/api/mess')

    @app.route('/')
    def index():
        return {"message": "Hostel Management System API is running modularly"}, 200

    return app