# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: "Star Wars" }, { name: "Lord of the Rings" }])
#   Character.create(name: "Luke", movie: movies.first)
require "open-uri"
puts "destroying everything"
Stay.destroy_all
Activity.destroy_all
Trip.destroy_all
User.destroy_all
puts "creating admin user"
user1 = User.create(email: "admin@gmail.com", password: "123456")
puts "creating trips"

file1 = URI.open("https://res.cloudinary.com/dtkrtgnr5/image/upload/v1686226359/bali1_b5xwxh.webp")
trip1 = Trip.new(name: "Weekend in Bali", location: "Bali", budget: "1000", user: user1)
trip1.photo.attach(io: file1, filename: "nes.png", content_type: "image/png")
trip1.save

stay1 = Stay.create(trip: trip1, category: "Hotel", name: "The Ritz-Carlton", address: "Jl. Raya Nusa Dua Selatan Jl. Nusa Dua, Lot III, Sawangan, Kec. Kuta Sel., Bali, 80361, Indonesien", cost: "1234$")
activity1 = Activity.create(trip: trip1, name: "surfing and drinks", cost: "250$", description: "Take your first surfing lessons with advanced teachersand enjoy a nice drink afterwards", category: "sport and drinks")


file2 = URI.open("https://res.cloudinary.com/dtkrtgnr5/image/upload/v1686226472/ibiza1_imcreo.webp")
trip2 = Trip.new(name: "One Night in Ibiza", location: "Ibiza", budget: "5000", user: user1)
trip2.photo.attach(io: file2, filename: "nes.png", content_type: "image/png")
trip2.save

stay2 = Stay.create(trip: trip2, category: "Hotel", name: "Torre del Mar", address: "Playa den bossa, C. de Carles Roman Ferrer, s/n, 07800 Eivissa, Illes Balears", cost: "279$")
activity2 = Activity.create(trip: trip2, name: "yoga session at the beach", cost: "250$", description: "Find your inner Piece at the beach with the amazing Paolo as your teacher", category: "relax")

file3 = URI.open("https://res.cloudinary.com/dtkrtgnr5/image/upload/v1686226533/hawaii1_hlocqa.webp")
trip3 = Trip.new(name: "Hawaii for the Summer", location: "Hawaii", budget: "35000", user: user1)
trip3.photo.attach(io: file3, filename: "nes.png", content_type: "image/png")
trip3.save

stay3 = Stay.create(trip: trip3, category: "Hotel", name: "Hawaiing shining", address: "Main Road,31, n203349 Hawaii", cost: "500$")
activity3 = Activity.create(trip: trip3, name: "Coconut tasting", cost: "250$", description: "Taste the best cocounts of Hawaii and see how the hawaainins process them to milk", category: "explore")

file4 = URI.open("https://res.cloudinary.com/dtkrtgnr5/image/upload/v1686564217/costa_rica_e6z0mi.avif")
trip4 = Trip.new(name: "Costa Rica Chica", location: "Puerto Viejo", budget: "520", user: user1)
trip4.photo.attach(io: file4, filename: "nes.png", content_type: "image/png")
trip4.save

stay4 = Stay.create(trip: trip4, category: "Hotel", name: "Hotel Pura Vida", address: "Calle de General, 4550178,Limon, Costa Rica", cost: "500$")
activity4 = Activity.create(trip: trip4, name: "Samnba Classes", cost: "250$", description: "Hips dont lie, prove yourself how good you really are at dancing", category: "fun")
