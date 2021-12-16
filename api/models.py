from . import db, ma


class Following(db.Model):
    __tablename__ = "followings"
    id = db.Column(db.Integer, primary_key=True)
    from_addr = db.Column(db.String())
    to_addr = db.Column(db.String())
    alias = db.Column(db.String())
    namespace = db.Column(db.String())
    created_at = db.Column(db.DateTime, server_default=db.func.now())
 
    def __init__(self, from_addr, to_addr, alias, namespace):
        self.from_addr = from_addr
        self.to_addr = to_addr
        self.alias = alias
        self.namespace = namespace
 
    def __repr__(self):
        return f"{self.namespace} {self.from_addr}:{self.alias}@{self.to_addr}"


class FollowingSchema(ma.Schema):
    class Meta:
        fields = ("from_addr", "to_addr", "alias", "namespace", "created_at")


following_schema = FollowingSchema()
followings_schema = FollowingSchema(many=True)
