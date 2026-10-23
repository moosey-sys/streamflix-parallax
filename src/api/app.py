import os
from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_pymongo import PyMongo, ObjectId
from bson import ObjectId
from bson.json_util import dumps
from datetime import datetime

app = Flask(__name__)

CORS(app)
app.config['MONGO_URI'] = os.environ.get('MONGO_URI', 'mongodb://127.0.0.1:27017/streamflix')
mongo = PyMongo(app)


@app.route('/api/data', methods=['GET'])
def get_data():
    data = mongo.db.collection.find()
    result = []
    for d in data:
        result.append({'key': d['value']})
    return jsonify(result)

@app.route('/api/data', methods=['POST'])
def add_data():
    key = request.json['key']
    mongo.db.collection.insert_one({'value': key})
    return jsonify({'message': 'Data added successfully'})

@app.route('/api/insert', methods=['GET', 'POST'])
def insert_json():
    try:
        data = {"message": "hello"}
        if not data:
            return jsonify({'error': 'No data provided'}), 400

        mongo.db.collection.insert_one(data)
        return jsonify({'message': 'Data inserted successfully'}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
@app.route('/api/getMovies', methods=['GET'])
def get_movies():
    data = mongo.db.movies.find()
    movie = [{
        '_id': str(movie['_id']), 
                'title': movie['title'],
                'description': movie['description'],
                'duration': movie['duration'],
                'rating': movie['rating'],
                'cast': movie['cast'],
                'genre': movie['genre'],
                'releaseDate': movie['releaseDate'],
                'imageUrl': movie['imageUrl'],
                'video': movie['video'],
            }  for movie in data]
    return jsonify(movie)

@app.route('/api/getUsers', methods=['GET'])
def get_users():
    data = mongo.db.users.find()
    user = [{
        '_id': str(user['_id']), 
                'username': user['username'],
                'email': user['email'],
                'password': user['password'],
              
            }  for user in data]
    return jsonify(user)
    
@app.route('/api/getTrending', methods=['GET'])
def get_trendings():
    data = mongo.db.trending.find()
    movie = [{
        '_id': str(movie['_id']), 
            'title': movie['title'],
            'description': movie['description'],
            'duration': movie['duration'],
            'rating': movie['rating'],
            'cast': movie['cast'],
            'genre': movie['genre'],
            'releaseDate': movie['releaseDate'],
            'imageUrl': movie['imageUrl'],
            'video': movie['video'],
        }  for movie in data]
  
    return jsonify(movie)

    
@app.route('/api/getTvshows', methods=['GET'])
def get_tvshows():
    data = mongo.db.tvshows.find()
    movie = [{
        '_id': str(movie['_id']), 
            'title': movie['title'],
            'description': movie['description'],
            'duration': movie['duration'],
            'rating': movie['rating'],
            'cast': movie['cast'],
            'genre': movie['genre'],
            'releaseDate': movie['releaseDate'],
            'imageUrl': movie['imageUrl'],
            'video': movie['video'],
        }  for movie in data]
    return jsonify(movie)

@app.route('/api/getTvshows/<movie_id>', methods=['GET'])
def find_tvshow(movie_id):
    movie = mongo.db.tvshows.find_one({'_id': ObjectId(movie_id)})
    if movie:
        movie['_id'] = str(movie['_id'])  
        return jsonify(movie), 200  
    else:
        return jsonify({"error": "Movie not found"}), 404
    
@app.route('/api/getTrending/<movie_id>', methods=['GET'])
def find_trending(movie_id):
    movie = mongo.db.trending.find_one({'_id': ObjectId(movie_id)})
    if movie:
        movie['_id'] = str(movie['_id'])  
        return jsonify(movie), 200  
    else:
        return jsonify({"error": "Movie not found"}), 404
    




@app.route('/api/getMovie/<movie_id>', methods=['GET'])
def get_movie(movie_id):
    movie = mongo.db.movies.find_one({'_id': ObjectId(movie_id)})
    if movie:
        movie['_id'] = str(movie['_id'])  
        return jsonify(movie), 200  
    else:
        return jsonify({"error": "Movie not found"}), 404
    


    
@app.route('/api/movieUpload', methods=['POST'])
def upload_movie():
    data = request.json
    

    title = data.get('title')
    cast = data.get('cast')
    description = data.get('description')
    duration = data.get('duration')
    genre = data.get('genre')
    rating = data.get('rating')
    release_date = data.get('releaseDate')
    image_url = data.get('imageUrl')
    video = data.get('video')


    movies_collection = mongo.db.movies
    movie_data = {
        'title': title,
        'cast': cast,
        'description': description,
        'duration': duration,
        'genre': genre,
        'rating': rating,
        'releaseDate': release_date,
        'imageUrl': image_url,
        'video': video
    }
    movies_collection.insert_one(movie_data)

    return jsonify({'message': 'Movie data added successfully'})


@app.route('/api/tvshowUpload', methods=['POST'])
def upload_tvshow():
    data = request.json
    

    title = data.get('title')
    cast = data.get('cast')
    description = data.get('description')
    duration = data.get('duration')
    genre = data.get('genre')
    rating = data.get('rating')
    release_date = data.get('releaseDate')
    image_url = data.get('imageUrl')
    video = data.get('video')


    movies_collection = mongo.db.tvshows
    movie_data = {
        'title': title,
        'cast': cast,
        'description': description,
        'duration': duration,
        'genre': genre,
        'rating': rating,
        'releaseDate': release_date,
        'imageUrl': image_url,
        'video': video
    }
    movies_collection.insert_one(movie_data)

    return jsonify({'message': 'TVshow data added successfully'})

@app.route('/api/trendingUpload', methods=['POST'])
def upload_trending():
    data = request.json
    

    title = data.get('title')
    cast = data.get('cast')
    description = data.get('description')
    duration = data.get('duration')
    genre = data.get('genre')
    rating = data.get('rating')
    release_date = data.get('releaseDate')
    image_url = data.get('imageUrl')
    video = data.get('video'),
    


    movies_collection = mongo.db.trending
    movie_data = {
        'title': title,
        'cast': cast,
        'description': description,
        'duration': duration,
        'genre': genre,
        'rating': rating,
        'releaseDate': release_date,
        'imageUrl': image_url,
        'video': video
    }
    movies_collection.insert_one(movie_data)

    return jsonify({'message': 'TVshow data added successfully'})

@app.route('/api/trendingEdit/<string:id>', methods=['PUT'])
def edit_trending(id):
    data = request.json

    title = data.get('title')
    cast = data.get('cast')
    description = data.get('description')
    duration = data.get('duration')
    genre = data.get('genre')
    rating = data.get('rating')
    release_date = data.get('releaseDate')
    image_url = data.get('imageUrl'),
    video = data.get('video'),

    movies_collection = mongo.db.trending
    movie_data = {
        'title': title,
        'cast': cast,
        'description': description,
        'duration': duration,
        'genre': genre,
        'rating': rating,
        'releaseDate': release_date,
        'imageUrl': image_url,
        'video': video
    }


    movie_id = ObjectId(id)


    movies_collection.update_one({'_id': movie_id}, {'$set': movie_data})

    return jsonify({'message': 'TV show data updated successfully'})


@app.route('/api/movieEdit/<string:id>', methods=['PUT'])
def edit_movie(id):
    data = request.json

    title = data.get('title')
    cast = data.get('cast')
    description = data.get('description')
    duration = data.get('duration')
    genre = data.get('genre')
    rating = data.get('rating')
    release_date = data.get('releaseDate')
    image_url = data.get('imageUrl'),
    video = data.get('video'),

    movies_collection = mongo.db.movies
    movie_data = {
        'title': title,
        'cast': cast,
        'description': description,
        'duration': duration,
        'genre': genre,
        'rating': rating,
        'releaseDate': release_date,
        'imageUrl': image_url,
        'video': video
    }


    movie_id = ObjectId(id)


    movies_collection.update_one({'_id': movie_id}, {'$set': movie_data})

    return jsonify({'message': 'TV show data updated successfully'})


@app.route('/api/tvshowEdit/<string:id>', methods=['PUT'])
def edit_tvshow(id):
    data = request.json

    title = data.get('title')
    cast = data.get('cast')
    description = data.get('description')
    duration = data.get('duration')
    genre = data.get('genre')
    rating = data.get('rating')
    release_date = data.get('releaseDate')
    image_url = data.get('imageUrl')
    video = data.get('video'),
    

    movies_collection = mongo.db.tvshows
    movie_data = {
        'title': title,
        'cast': cast,
        'description': description,
        'duration': duration,
        'genre': genre,
        'rating': rating,
        'releaseDate': release_date,
        'imageUrl': image_url,
        'video': video
    }


    movie_id = ObjectId(id)


    movies_collection.update_one({'_id': movie_id}, {'$set': movie_data})

    return jsonify({'message': 'TV show data updated successfully'})

@app.route('/api/trendingDelete/<string:id>', methods=['DELETE'])
def delete_trending(id):
    try:
  
        movie_id = ObjectId(id)


        result = mongo.db.trending.delete_one({'_id': movie_id})

        if result.deleted_count == 1:
            return jsonify({'message': 'TV show data deleted successfully'})
        else:
            return jsonify({'message': 'No TV show found with the specified id'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    

@app.route('/api/userDelete/<string:id>', methods=['DELETE'])
def delete_user(id):
    try:
  
        user_id = ObjectId(id)


        result = mongo.db.users.delete_one({'_id': user_id})

        if result.deleted_count == 1:
            return jsonify({'message': 'TV show data deleted successfully'})
        else:
            return jsonify({'message': 'No TV show found with the specified id'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    

    
@app.route('/api/movieDelete/<id>', methods=['DELETE'])
def delete_movie(id):
    try:

        movie_id = ObjectId(id)


        result = mongo.db.movies.delete_one({'_id': movie_id})

        if result.deleted_count == 1:
            return jsonify({'message': 'TV show data deleted successfully'})
        else:
            return jsonify({'message': 'No TV show found with the specified id'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
    
@app.route('/api/tvshowDelete/<string:id>', methods=['DELETE'])
def delete_tvshow(id):
    try:

        movie_id = ObjectId(id)


        result = mongo.db.tvshows.delete_one({'_id': movie_id})

        if result.deleted_count == 1:
            return jsonify({'message': 'TV show data deleted successfully'})
        else:
            return jsonify({'message': 'No TV show found with the specified id'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
@app.route('/api/addToFavorites/<movie_id>', methods=['POST'])
def add_to_favorites(movie_id):
    user_id = request.json.get('userID')

    if not user_id:
        return jsonify({'error': 'User ID is required'}), 400

    try:
        user_id = ObjectId(user_id)
    except Exception as e:
        return jsonify({'error': 'Invalid user ID format'}), 400

    user_favorites = mongo.db.favoriteList.find_one({"user_id": user_id})
    
    if user_favorites:
        if movie_id in user_favorites["movieIDs"]:
            return jsonify({'message': 'Movie already added'}), 200
        else:
            mongo.db.favoriteList.update_one(
                {"user_id": user_id},
                {"$push": {"movieIDs": movie_id}}
            )
    else:
        mongo.db.favoriteList.insert_one({"user_id": user_id, "movieIDs": [movie_id]})
    
    return jsonify({'message': 'Movie added to favorites successfully'}), 200


@app.route('/api/getFavoriteMovies/<user_id>', methods=['GET'])
def get_favorite_movies(user_id):
    try:
        user_id = ObjectId(user_id)

        favorite_movies = mongo.db.favoriteList.find_one({"user_id": user_id})

        if not favorite_movies:
            return jsonify([]), 200

        movie_ids = favorite_movies.get("movieIDs", [])

        movies_details = []
        for movie_id in movie_ids:
            movie_id_obj = ObjectId(movie_id)
            movie_details = mongo.db.movies.find_one({"_id": movie_id_obj})
            if not movie_details:
                movie_details = mongo.db.trending.find_one({"_id": movie_id_obj})
            if not movie_details:
                movie_details = mongo.db.tvshows.find_one({"_id": movie_id_obj})

            if movie_details:
                movies_details.append(movie_details)

        return dumps(movies_details), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    

@app.route('/api/register', methods=['POST'])
def register_user():
    user_data = request.json
   
    username = user_data.get('username')
    email = user_data.get('email')
    password = user_data.get('password')


    if mongo.db.users.find_one({'username': username}):
        return jsonify({'message': 'Username already exists'}), 400

    user_id = mongo.db.users.insert_one({'email': email, 'username': username, 'password': password}).inserted_id

    return jsonify({'message': 'User registered successfully', 'user_id': str(user_id)}), 201


@app.route('/api/login', methods=['POST'])
def login_user():
    user_data = request.json
    email = user_data.get('email')

    password = user_data.get('password')

    user = mongo.db.users.find_one({'email': email, 'password': password})

    if not user:
        return jsonify({'message': 'Invalid email or password'}), 401

    return jsonify({'message': 'Login successful', 'user_id': str(user['_id'])}), 200


@app.route('/api/search', methods=['GET'])
def search_movies():
    query = request.args.get('query', '').lower()
    results = []

    movies_collection = mongo.db.movies.find()
    for movie in movies_collection:
        if query in movie['title'].lower():

            movie['_id'] = str(movie['_id'])
            results.append(movie)
    return jsonify(results)

@app.route('/api/addPayment', methods=['POST']) 
def add_payment_method():
    data = request.get_json()
    user_id = data.get('userid')
    payment_method = data.get('payment_method')
    subscription = data.get('subscription')

    if not user_id:
        return jsonify({'error': 'User ID not provided'}), 400


    user = mongo.db.users.find_one({'email': user_id})

    if not user:
        return jsonify({'error': 'User not found'}), 404

 
    order = {
        'email': user_id,
        'payment_method': payment_method,
        'date': datetime.now(),
        'subscription': subscription
    }
    mongo.db.order.insert_one(order)

    return jsonify("good"), 200

@app.route('/api/orders', methods=['GET'])
def get_orders():
    data = mongo.db.order.find()
    movie = [{
        '_id': str(movie['_id']), 
            'email': movie['email'],
            'payment_method': movie['payment_method'],
            'date': movie['date'],
            'subscription': movie['subscription'],
           
        }  for movie in data]
    return jsonify(movie)

if __name__ == '__main__':
    app.run(debug=True, port=5002)

