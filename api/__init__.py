import os
import traceback

from requests import get

from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
from flask_restful import Api, Resource, reqparse
from flask import send_from_directory, request
from flask_cors import CORS, cross_origin


IS_DEV = os.environ.get("FLASK_ENV") == "development"
WEBPACK_DEV_SERVER_HOST = "http://localhost:3000"


db = SQLAlchemy()
ma = Marshmallow()


def proxy(host, path):
    response = get(f"{host}{path}")
    excluded_headers = [
        "content-encoding",
        "content-length",
        "transfer-encoding",
        "connection",
    ]
    headers = {
        name: value
        for name, value in response.raw.headers.items()
        if name.lower() not in excluded_headers
    }
    return (response.content, response.status_code, headers)


def create_app():
    """Construct the core application."""

    if IS_DEV:
        app = Flask(__name__, static_url_path='/xxx')
        app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///../database.db'
    else:
        app = Flask(__name__, static_folder=os.path.abspath("web/build"))
        app.config['SQLALCHEMY_DATABASE_URI'] = os.environ['DATABASE_URL'].replace('postgres', 'postgresql')

    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['CORS_HEADERS'] = 'Content-Type'
    CORS(app)

    db.init_app(app)
    ma.init_app(app)
    with app.app_context():
        from . import handlers  # Import routes

        try:
            db.create_all()  # Create database tables for our data models
        except:
            traceback.print_exc()

        @app.route("/", defaults={"path": "index.html"})
        @app.route("/<path:path>")
        @cross_origin()
        def serve(path):
            if IS_DEV:
                return proxy(WEBPACK_DEV_SERVER_HOST, request.path)

            return app.send_static_file(path)

        api = Api(app)
        api.add_resource(handlers.FollowingHandler, '/api/followings', endpoint='e1')
        api.add_resource(handlers.FollowingHandler, '/api/followings/<from_addr>', endpoint='e2')
        api.add_resource(handlers.FollowerHandler, '/api/follower_count/<addr>')
        api.add_resource(handlers.SocialCloudHandler, '/api/social_cloud')

        return app
