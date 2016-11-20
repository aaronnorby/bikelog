curl -i -X POST -H "Content-Type: application/json" -d '{"date": "2016-11-01-00-00", "description": "lube chain", "note":"triflow", "bike_id": 1}' "localhost:5000/api/maintenance_events"

curl -i -X GET "localhost:5000/api/maintenance_events/1"

curl -i -X POST -H "Content-Type: application/json" -d '{"name": "Trek", "purchased_at": "2015-03-28-00-00"}' "localhost:5000/api/bike"

curl -i -H "Authorization: Bearer tokengoeshere" -X GET "localhost:5000/bike/1"

curl -i -u norby:secret "localhost:5000/token"
