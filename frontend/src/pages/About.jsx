import { motion } from 'framer-motion';
import { CheckCircleIcon } from '@heroicons/react/24/outline';

function About() {
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const clients = [
    { name: 'New Look (UK & Germany)' },
    { name: 'Peacocks (UK)' },
    { name: 'JD Williams (UK)' },
    { name: 'Missguided (UK)' },
    { name: 'Suzy Shier (Canada)' },
    { name: 'Gate sa (Slovakia)' }
  ];

  const features = [
    {
      title: 'Sourcing the Best Quality Apparel',
      description: 'We prioritize sourcing the finest fabrics and garments, ensuring an exceptional experience for our customers.',
      icon: '👕'
    },
    {
      title: 'Most Competitive Pricing',
      description: 'Affordability and value go hand-in-hand, and we pride ourselves on offering the most competitive prices in the industry.',
      icon: '💰'
    },
    {
      title: 'Professional Working Environment',
      description: 'Our professional and ethical approach to sourcing sets us apart, fostering trust and long-term partnerships.',
      icon: '🤝'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative h-[60vh] bg-black flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1920&auto=format&fit=crop"
            alt="Clothing Rack"
            className="w-full h-full object-cover opacity-50"
          />
        </div>
        <div className="relative text-center text-white z-10 max-w-4xl mx-auto px-4">
          <motion.h1 
            className="text-5xl md:text-7xl font-bold mb-6"
            {...fadeIn}
          >
            We Are a Lifestyle Brand
          </motion.h1>
          <motion.p 
            className="text-xl md:text-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            Studio Patsons Limited is a Buying agent of ready-made garments in Bangladesh.
          </motion.p>
        </div>
      </div>

      {/* About Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <motion.div 
          className="prose prose-lg mx-auto text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <p className="text-gray-600 text-lg leading-relaxed">
            Studio Patsons Limited is a Buying agent of ready-made garments in Bangladesh. Studio Patsons specializes in Sweater and Denim products. Through good communication, excellent working relationships and responding to our customers' needs, we have developed a unique, effective, reliable and professional operating structure and sourcing concept that ensures we retain our position in the UK, Canada, Germany, Slovakia market.
          </p>
        </motion.div>
      </div>

      {/* Mission Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <img
                src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=800&auto=format&fit=crop"
                alt="Fashion Items"
                className="rounded-lg shadow-xl"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold mb-6">Our Mission</h2>
              <p className="text-gray-600 text-lg leading-relaxed">
                We satisfy our buyers as well as other regulatory requirements ensuring to provide quality service and products. To meet the goal, we are committed to put the best endeavors and work as a team efficiently for continual improvement of the quality management system.
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <motion.h2 
            className="text-4xl font-bold text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Why Choose Studio Patsons?
          </motion.h2>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                className="text-center p-6 rounded-xl bg-white shadow-lg"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
                viewport={{ once: true }}
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Clients Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <motion.h2 
            className="text-4xl font-bold text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Our Esteemed Clients
          </motion.h2>
          <div className="grid md:grid-cols-3 gap-6">
            {clients.map((client, index) => (
              <motion.div
                key={client.name}
                className="flex items-center space-x-3 bg-white p-4 rounded-lg shadow"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
              >
                <CheckCircleIcon className="h-6 w-6 text-blue-500" />
                <span className="text-gray-800">{client.name}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Quote */}
      <div className="py-16 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <motion.p
            className="text-xl text-gray-600 italic"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            With seven years of experience, Studio Patsons Limited stands as a fast-growing apparel R&D, merchandising, and sourcing company. We are more than a buying house; we are a strategic partner dedicated to delivering excellence in every stitch.
          </motion.p>
        </div>
      </div>
    </div>
  );
}

export default About;