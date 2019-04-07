# Trip Data Fields
Each trip has the following fields. See the descriptions below.
- trip_id
- taxi_id
- trip_start_timestamp
- trip_end_timestamp
- trip_seconds
- trip_miles
- pickup_community_area
- dropoff_community_area
- fare
- tips
- tolls
- extras
- trip_total
- pickup_centroid_latitude
- pickup_centroid_longitude
- dropoff_centroid_latitude
- dropoff_centroid_longitude

## Trip ID 
A unique identifier for the trip.
- **Type:** `Plain Text`
- **Field Name:** `trip_id`

## Taxi ID 
A unique identifier for the taxi.
- **Type:** `Plain Text`
- **Field Name:** `taxi_id`

## Trip Start Timestamp    
When the trip started, rounded to the nearest 15 minutes.
- **Type:** `Date & Time`
- **Field Name:** `trip_start_timestamp`

## Trip End Timestamp  
When the trip ended, rounded to the nearest 15 minutes.
- **Type:** `Date & Time`
- **Field Name:** `trip_end_timestamp`

## Trip Seconds    
Time of the trip in seconds.
- **Type:** `Number`
- **Field Name:** `trip_seconds`

## Trip Miles  
Distance of the trip in miles.
- **Type:** `Number`
- **Field Name:** `trip_miles`

## Pickup Community Area   
The Community Area where the trip began.
- **Type:** `Number`
- **Field Name:** `pickup_community_area`

## Dropoff Community Area  
The Community Area where the trip ended.
- **Type:** `Number`
- **Field Name:** `dropoff_community_area`

## Fare    
The fare for the trip.
- **Type:** `Number`
- **Field Name:** `fare`

## Tips    
The tip for the trip. Cash tips generally will not be recorded.
- **Type:** `Number`
- **Field Name:** `tips`

## Tolls   
The tolls for the trip.
- **Type:** `Number`
- **Field Name:** `tolls`

## Extras  
Extra charges for the trip.
- **Type:** `Number`
- **Field Name:** `extras`

## Trip Total  
Total cost of the trip, the total of the previous columns.
- **Type:** `Number`
- **Field Name:** `trip_total`

## Company 
The taxi company.
- **Type:** `Plain Text`
- **Field Name:** `company`

## Pickup Centroid Latitude    
The latitude of the center of the pickup census tract or the community area if the census tract has been hidden for privacy.
- **Type:** `Number`
- **Field Name:** `pickup_centroid_latitude`

## Pickup Centroid Longitude   
The longitude of the center of the pickup census tract or the community area if the census tract has been hidden for privacy.
- **Type:** `Number`
- **Field Name:** `pickup_centroid_longitude`

## Dropoff Centroid Latitude   
The latitude of the center of the dropoff census tract or the community area if the census tract has been hidden for privacy.
- **Type:** `Number`
- **Field Name:** `dropoff_centroid_latitude`

## Dropoff Centroid Longitude  
The longitude of the center of the dropoff census tract or the community area if the census tract has been hidden for privacy.
- **Type:** `Number`
- **Field Name:** `dropoff_centroid_longitude`
