// Live Data extracted from MandalaTickets.com
const SITE_DATA = {
    cities: {
        cancun: {
            name: "Cancun",
            image: "images/Cancun-Experience.jpg",
            venues: [
                {
                    id: "mandala-cancun", name: "Mandala Nightclub", image: "images/venues/Mandala_CUN.jpeg", video: "https://mandalatickets.com/assets/videos/cancun/n_mandala.mp4", price: 60, rating: 4.9,
                    desc: "When you are in Cancun you must dedicate one of your nights to Mandala. Incredible nights, the best music and its open facade from which you can admire everything that implies being the favorite nightclub in the city.",
                    address: "Blvd. Kukulcan Km 9.5, Hotel Zone, Cancun", hours: "10:00 PM - 5:00 AM", dressCode: "Smart Casual",
                    customUrl: "en/cancun/disco/mandala/index.html"
                },
                {
                    id: "mandala-beach-day", name: "Mandala Beach Club", image: "images/venues/MB_CUN.jpg", video: "https://mandalatickets.com/assets/videos/cancun/n_mandala-beach.mp4", price: 50, rating: 4.8,
                    desc: "Enjoy the best daytime club in Cancun. Immerse yourself in the vibrant atmosphere, refreshing cocktails, and incredible pools.", tag: "Day Party",
                    address: "Blvd. Kukulcan Km 9.5, Hotel Zone, Cancun", hours: "11:00 AM - 6:00 PM", dressCode: "Beachwear",
                    customUrl: "en/cancun/disco/mandala-beach/index.html"
                },
                {
                    id: "rakata-cancun", name: "Rakata", image: "images/venues/Rakata_CUN.jpg", video: "https://mandalatickets.com/assets/videos/cancun/n_rakata.mp4", price: 40, rating: 4.6,
                    desc: "The ultimate urban and reggaeton destination in Cancun.",
                    address: "Blvd. Kukulcan Km 9.5, Hotel Zone, Cancun", hours: "10:00 PM - 5:00 AM", dressCode: "Casual",
                    customUrl: "en/cancun/disco/rakata/index.html"
                },
                {
                    id: "la-vaquita-cancun", name: "La Vaquita", image: "images/venues/Vaquita_CUN.jpg", video: "https://mandalatickets.com/assets/videos/cancun/n_la-vaquita.mp4", price: 40, rating: 4.5,
                    desc: "Famous for its liters, cow print themes, and hip-hop beats.",
                    address: "Blvd. Kukulcan Km 9.5, Hotel Zone, Cancun", hours: "10:00 PM - 4:00 AM", dressCode: "Casual",
                    customUrl: "en/cancun/disco/la-vaquita/index.html"
                },

                {
                    id: "dcave-cancun", name: "D'Cave", image: "images/venues/MT_dcave.jpg", video: "https://mandalatickets.com/assets/uploads/video/cancun/d-cave.mp4", price: 70, rating: 4.8,
                    desc: "Luxury nightlife experience for the elite with exclusive bottle service.",
                    address: "Blvd. Kukulcan Km 9.5, Hotel Zone, Cancun", hours: "11:00 PM - 6:00 AM", dressCode: "Formal / Upscale",
                    customUrl: "en/cancun/disco/d-cave/index.html"
                },
                {
                    id: "house-of-fiesta-cancun", name: "House Of Fiesta", image: "images/venues/HOF_CUN.jpg", video: "https://mandalatickets.com/assets/videos/cancun/n_house-of-fiesta.mp4", price: 55, rating: 4.7,
                    desc: "Experience the ultimate party destination with world-class entertainment and vibrant atmosphere.",
                    address: "Blvd. Kukulcan Km 9.5, Hotel Zone, Cancun", hours: "10:00 PM - 5:00 AM", dressCode: "Smart Casual",
                    customUrl: "en/cancun/disco/house-of-fiesta/index.html"
                },
                {
                    id: "senor-frogs-cancun", name: "Señor Frogs Cancun", image: "images/venues/Mandala_CUN.jpeg", video: "https://mandalatickets.com/assets/videos/cancun/n_frogs.mp4", price: 45, rating: 4.6,
                    desc: "The iconic party bar in Cancun. Live shows, themed nights and the wildest atmosphere on the strip.",
                    address: "Blvd. Kukulcan Km 9.5, Hotel Zone, Cancun", hours: "10:00 PM - 5:00 AM", dressCode: "Casual",
                    customUrl: "en/cancun/disco/frogs/index.html"
                },
                {
                    id: "mandala-beach-night", name: "Mandala Beach Night", image: "images/venues/MBN_CUN.jpg", video: "https://mandalatickets.com/assets/videos/cancun/n_mandala-pp.mp4", price: 60, rating: 4.8,
                    desc: "The best nighttime beach party in Cancun. Experience the energy and excitement under the stars.", tag: "Night Party",
                    address: "Blvd. Kukulcan Km 9.5, Hotel Zone, Cancun", hours: "8:00 PM - 2:00 AM", dressCode: "Beachwear",
                    customUrl: "en/cancun/disco/mandala-beach/index.html"
                }
            ],
            aboutText: "Cancun is known for its vibrant nightlife and is undoubtedly the ultimate destination for partygoers."
        },
        playa: {
            name: "Playa del Carmen",
            image: "images/3_n.png",
            venues: [
                {
                    id: "mandala-playa", name: "Mandala Playa", image: "images/venues/Mandala_CUN.jpeg", video: "https://mandalatickets.com/assets/videos/playa/n_mandala.mp4", price: 55, rating: 4.8,
                    desc: "Discover the vibrant nightlife of Mandala in Playa del Carmen. Dance to the hottest rhythms and create unforgettable memories.",
                    address: "Calle 12 Nte, Centro, Playa del Carmen", hours: "10:00 PM - 5:00 AM", dressCode: "Smart Casual",
                    customUrl: "en/playa/disco/mandala/index.html"
                },
                {
                    id: "la-vaquita-playa", name: "La Vaquita Playa", image: "images/venues/Vaquita_CUN.jpg", video: "https://mandalatickets.com/assets/videos/playa/n_la-vaquita.mp4", price: 40, rating: 4.5,
                    desc: "Get ready for a night at La Vaquita Playa del Carmen, the wildest club in Playa. Book your spot now!",
                    address: "Calle 12 Nte, Centro, Playa del Carmen", hours: "10:00 PM - 4:00 AM", dressCode: "Casual",
                    customUrl: "en/playa/disco/la-vaquita/index.html"
                },
                {
                    id: "santito-tun-tun", name: "Santito Tun Tun", image: "images/1_n.png", price: 45, rating: 4.7,
                    desc: "Stylish and chic, perfect for cocktails and dancing. The place to be seen in Playa.",
                    address: "Calle 12 Nte, Centro, Playa del Carmen", hours: "10:00 PM - 4:00 AM", dressCode: "Smart Casual",
                    customUrl: "en/playa/disco/santito-tun-tun/index.html"
                }
            ]
        },
        vallarta: {
            name: "Puerto Vallarta",
            image: "images/1_n.png",
            venues: [
                {
                    id: "mandala-vallarta", name: "Mandala Vallarta", image: "images/venues/Mandala_CUN.jpeg", video: "https://mandalatickets.com/assets/videos/vallarta/n_mandala.mp4", price: 50, rating: 4.9,
                    desc: "Experience the vibrant nightlife of Puerto Vallarta at Mandala. Enjoy top-notch entertainment and a lively atmosphere.",
                    address: "Paseo Díaz Ordaz 633, Centro, Puerto Vallarta", hours: "10:00 PM - 6:00 AM", dressCode: "Smart Casual",
                    customUrl: "en/vallarta/disco/mandala/index.html"
                },
                {
                    id: "chicabal-vallarta", name: "Chicabal Sunset Club", image: "images/BANNER_01_MT(1).jpg", video: "https://mandalatickets.com/assets/videos/vallarta/n_chicabal.mp4", price: 60, rating: 4.8,
                    desc: "Explore the paradise of beach clubs at Chicabal Puerto Vallarta. Enjoy breathtaking views, refreshing drinks, and a vibrant atmosphere.",
                    address: "Zona Hotelera, Puerto Vallarta", hours: "1:00 PM - 8:00 PM", dressCode: "Beach Chic", tag: "Day Party",
                    customUrl: "en/vallarta/disco/chicabal/index.html"
                },
                {
                    id: "la-santa-vallarta", name: "La Santa", image: "images/2_n.png", video: "https://mandalatickets.com/assets/videos/vallarta/n_la-santa.mp4", price: 55, rating: 4.7,
                    desc: "The most exclusive nightclub in Vallarta. Style, glamour and party.",
                    address: "Zona Hotelera, Puerto Vallarta", hours: "10:00 PM - 5:00 AM", dressCode: "Upscale",
                    customUrl: "en/vallarta/disco/la-santa/index.html"
                },
                {
                    id: "la-vaquita-vallarta", name: "La Vaquita Vallarta", image: "images/venues/Vaquita_CUN.jpg", video: "https://mandalatickets.com/assets/videos/vallarta/n_la-vaquita.mp4", price: 40, rating: 4.5,
                    desc: "The wildest nightlife in Puerto Vallarta. Liters, cow print and non-stop hip-hop.",
                    address: "Zona Hotelera, Puerto Vallarta", hours: "10:00 PM - 4:00 AM", dressCode: "Casual",
                    customUrl: "en/vallarta/disco/la-vaquita/index.html"
                },
                {
                    id: "rakata-vallarta", name: "Rakata Vallarta", image: "images/venues/Rakata_CUN.jpg", video: "https://mandalatickets.com/assets/videos/vallarta/n_rakata.mp4", price: 40, rating: 4.6,
                    desc: "Urban beats and reggaeton in Puerto Vallarta. The place to dance all night.",
                    address: "Zona Hotelera, Puerto Vallarta", hours: "10:00 PM - 5:00 AM", dressCode: "Casual",
                    customUrl: "en/vallarta/disco/rakata/index.html"
                }
            ]
        },
        cabos: {
            name: "Los Cabos",
            image: "images/4_n.png",
            venues: [
                {
                    id: "mandala-cabos", name: "Mandala Los Cabos", image: "images/venues/Mandala_CUN.jpeg", video: "https://mandalatickets.com/assets/videos/cabos/n_mandala.mp4", price: 60, rating: 4.9,
                    desc: "Mandala Cabo, the best nightclub in Los Cabos invites you to enjoy the hits of the moment and experience the best party nights.",
                    address: "Lázaro Cárdenas 1112, Centro, Cabo San Lucas", hours: "10:00 PM - 5:00 AM", dressCode: "Smart Casual",
                    customUrl: "en/cabos/disco/mandala/index.html"
                },
                {
                    id: "la-vaquita-cabos", name: "La Vaquita Cabos", image: "images/venues/Vaquita_CUN.jpg", video: "https://mandalatickets.com/assets/videos/cabos/n_la-vaquita.mp4", price: 45, rating: 4.6,
                    desc: "Experience the wildest nightlife in Los Cabos at La Vaquita. Enjoy energetic music, lively atmosphere, and unforgettable party nights.",
                    address: "Centro, Cabo San Lucas", hours: "10:00 PM - 4:00 AM", dressCode: "Casual",
                    customUrl: "en/cabos/disco/la-vaquita/index.html"
                }
            ]
        },
        tulum: {
            name: "Tulum",
            image: "images/BANNER_05_MT_VAGALUME_2.jpg",
            venues: [
                {
                    id: "vagalume-tulum", name: "Vagalume Beach Club", image: "images/BANNER_05_MT_VAGALUME_2.jpg", video: "https://mandalatickets.com/assets/videos/tulum/n_vagalume.mp4", price: 80, rating: 4.8,
                    desc: "Immerse yourself in the vibrant music and entertainment experience at Vagalume Club Tulum. Luxury meets relaxation on the shores.",
                    address: "Carr. Tulum-Boca Paila Km 8.5, Tulum", hours: "1:00 PM - 1:00 AM", dressCode: "Boho Chic", tag: "Day & Night",
                    customUrl: "en/tulum/disco/vagalume/index.html"
                },
                {
                    id: "bonbonniere-tulum", name: "Bonbonniere Tulum", image: "images/2_n.png", video: "https://mandalatickets.com/assets/videos/tulum/n_bonbonniere.mp4", price: 100, rating: 4.9,
                    desc: "Discover the First-class Party at Bonbonniere Tulum. Enjoy the perfect combination of top-notch music and entertainment.",
                    address: "Carr. Tulum-Boca Paila Km 10, Tulum", hours: "11:00 PM - 6:00 AM", dressCode: "Upscale",
                    customUrl: "en/tulum/disco/bonbonniere/index.html"
                },
                {
                    id: "tehmplo-tulum", name: "Tehmplo Tulum", image: "images/1_n.png", video: "https://mandalatickets.com/assets/videos/tulum/n_tehmplo.mp4", price: 90, rating: 4.7,
                    desc: "Discover Tehmplo Tulum: an extraordinary jungle venue in Tulum, hosting massive events with a bohemian vibe.",
                    address: "Tulum", hours: "10:00 PM - 5:00 AM", dressCode: "Boho Chic",
                    customUrl: "en/tulum/disco/tehmplo/index.html"
                },
                {
                    id: "bagatelle-tulum", name: "Bagatelle Tulum", image: "images/3_n.png", video: "https://mandalatickets.com/assets/videos/tulum/n_bagatelle.mp4", price: 120, rating: 4.9,
                    desc: "Experience the essence of Tulum at Bagatelle: a destination where elegance meets vibrant energy. A playground of sound and elegance.",
                    address: "Carr. Tulum-Boca Paila, Tulum", hours: "7:00 PM - 2:00 AM", dressCode: "Elegant", tag: "Day & Night",
                    customUrl: "en/tulum/disco/bagatelle/index.html"
                }
            ]
        },
        madrid: {
            name: "Madrid",
            image: "images/1_n.png",
            venues: [
                {
                    id: "houdinni-madrid", name: "Houdinni", image: "images/venues/Mandala_CUN.jpeg", video: "", price: 50, rating: 4.5,
                    desc: "Experience the magic of Madrid nightlife at Houdinni.",
                    address: "Madrid, Spain", hours: "11:00 PM - 6:00 AM", dressCode: "Smart Casual",
                    customUrl: "en/madrid/disco/houdinni/index.html"
                },
                {
                    id: "sala-de-despecho-madrid", name: "Sala De Despecho", image: "images/venues/Vaquita_CUN.jpg", video: "", price: 45, rating: 4.4,
                    desc: "The best place to sing your heart out and party in Madrid.",
                    address: "Madrid, Spain", hours: "11:00 PM - 5:00 AM", dressCode: "Casual",
                    customUrl: "en/madrid/disco/sala-de-despecho/index.html"
                }
            ]
        },
        marbella: {
            name: "Marbella",
            image: "images/1_n.png",
            venues: [
                {
                    id: "bonbonniere-marbella", name: "Bonbonniere Marbella", image: "images/2_n.png", video: "", price: 80, rating: 4.8,
                    desc: "First-class nightlife in Marbella. Tables, tickets and the Bonbonniere party on the Costa del Sol.",
                    address: "Marbella, Spain", hours: "11:00 PM - 6:00 AM", dressCode: "Upscale",
                    customUrl: "en/marbella/disco/bonbonniere/index.html"
                }
            ]
        }
    }
};
