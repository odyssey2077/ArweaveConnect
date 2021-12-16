import json
import web3

from flask_restful import Api, Resource, reqparse
from flask import Flask, request, jsonify, abort, make_response

from .models import Following, db, following_schema, followings_schema
from .utils import update_db_file, verify_signature


def error(code, message):
  abort(make_response({'error_message': message}, code))


def validate_addr(addr):
  if not web3.Web3.isAddress(addr):
    error(400, 'not valid eth address')


def validate_request():
  from_addr = request.json.get('from_addr')
  to_addr = request.json.get('to_addr')
  namespace = request.json.get('namespace')
  signature = request.json.get('signature')

  if not from_addr or not to_addr or not namespace:
    error(400, 'invalid request, missing one or multiple fields')

  validate_addr(request.json['from_addr'])
  validate_addr(request.json['to_addr'])

  if not signature:
    error(401, 'request is not signed!')

  signed_data = {
    'from_addr':request.json['from_addr'],
    'to_addr':request.json['to_addr'],
    'namespace':request.json['namespace'],
  }
  if verify_signature(signed_data, signature) != from_addr:
    error(401, 'transaction not signed by from address!')


class SocialCloudHandler(Resource):
  def get(self):
    followings = Following.query.all()
    addresses = set()
    nodes = []
    links = []
    for following in followings:
      addresses.add(following.to_addr)
      addresses.add(following.from_addr)
      links.append({'source': following.from_addr, 'target': following.to_addr, 'value': 1})
    for addr in addresses:
      nodes.append({'id': addr, 'group': 1})
    return make_response({'nodes': nodes, 'links': links})


class FollowerHandler(Resource):
  def get(self, addr):
    validate_addr(addr)
    count = Following.query.filter_by(to_addr=addr).count()
    return make_response({'count': count})


class FollowingHandler(Resource):

  def _get_following(self):
    return Following.query.filter_by(
      from_addr=request.json['from_addr'],
      to_addr=request.json['to_addr'],
      namespace=request.json['namespace'])

  def get(self, from_addr):
    validate_addr(from_addr)
    followings = Following.query.filter_by(from_addr=from_addr)
    return followings_schema.dump(followings)

  def post(self):
    validate_request()

    if self._get_following().count() > 0:
      error(400, "Connection already exists!")

    following = Following(
      from_addr=request.json['from_addr'],
      to_addr=request.json['to_addr'],
      alias=request.json['alias'],
      namespace=request.json['namespace']
    )
    db.session.add(following)
    db.session.commit()
    update_db_file()
    return following_schema.dump(following)
  
  def delete(self):
    validate_request()
    query = self._get_following()
    size = query.count()
    if size == 1:
      following = query.first()
      db.session.delete(following)
      db.session.commit()
      update_db_file()
      return following_schema.dump(following)
    elif size > 1:
      error(500, "Found more than connections? failed to unfollow.")
    else:
      error(404, "Could not find the connection!")
