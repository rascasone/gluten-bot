var pg = require('pg');

var pgQuery = function(query, vars) {
    return new Promise(function(success, error) {
        pg.connect(process.env.DB_PG, function(err, client, done) {
            if(err) return error(err);
            client.query(query, vars, function(err, result) {
                done();
                if(err) return error(err);
                success(result);
            });
        });
    });
}

var db = {
    createRestaurant: function(id) {
        if(id) return pgQuery(`
            INSERT INTO restaurants (id) VALUES ($1::int)`, [id]);
    },
    postRating: function(id, newRating) {
        return pgQuery(`
            UPDATE restaurants
            SET rating = array_append(rating, $2::int)
            WHERE id = $1::int`, [id, newRating]);
    },
    getRestaurant: function(id) {
        return pgQuery(`
            SELECT *
            FROM restaurants
            WHERE id = $1::int`, [id]);
    },
    search: function(user_id) {
        return pgQuery(`
            INSERT INTO searches (user_id)
            VALUES ('` + user_id + `')`, []);
    },
    getSearch: function(user_id) {
        return pgQuery(`
            SELECT searches.*, search_restaurant.*
            FROM searches,
            (SELECT ARRAY(
                SELECT row_to_json(row)
                FROM (SELECT * FROM search_restaurants) row
            ) search_restaurant) search_restaurant
            WHERE searches.user_id = '` + user_id + `'
            ORDER BY time DESC LIMIT 1`, [user_id]);
    },
    getSearches: function() {
        var promise = pgQuery(`SELECT * FROM searches WHERE age(now(), time) > '1 minute' AND done = false`);
        pgQuery(`UPDATE searches SET done = true WHERE age(now(), time) > '1 minute'`)
        return promise;
    },
    searchClick: function(user_id, restaurant_id) {
        return pgQuery(`SELECT * FROM search_restaurants JOIN searches as sr ON sr.id = search_restaurants.search_id WHERE sr.user_id='` + user_id + `' AND restaurant_id=$1::int`, [restaurant_id]).then(function(result) {
            if(result.rows.length === 0) {
                return pgQuery(`SELECT * FROM searches WHERE user_id='` + user_id + `' ORDER BY time DESC LIMIT 1`).then(function(result) {
                    return pgQuery(`
                        INSERT INTO search_restaurants (search_id, restaurant_id, clicks)
                        VALUES ($1::int, $2::int, $3::int)`, [result.rows[0].id, restaurant_id, 1]);
                });
            } else {
                return pgQuery(`SELECT * FROM searches WHERE user_id='` + user_id + `' ORDER BY time DESC LIMIT 1`).then(function(result) {
	                return pgQuery(`
                        UPDATE search_restaurants
                        SET clicks = clicks + 1
                        WHERE search_id=$1::int`, [result.rows[0].id])
                });
            }
        });
    }
}

module.exports = db;
