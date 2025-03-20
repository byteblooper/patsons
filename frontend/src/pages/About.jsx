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
      icon: ''
    },
    {
      title: 'Most Competitive Pricing',
      description: 'Affordability and value go hand-in-hand, and we pride ourselves on offering the most competitive prices in the industry.',
      icon: ''
    },
    {
      title: 'Professional Working Environment',
      description: 'Our professional and ethical approach to sourcing sets us apart, fostering trust and long-term partnerships.',
      icon: ''
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
      <div className="py-24 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 opacity-[0.03]">
          <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-sky-600 rounded-full -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-indigo-600 rounded-full translate-x-1/2 translate-y-1/2" />
        </div>

        <div className="max-w-7xl mx-auto px-4 relative">
          <motion.div 
            className="text-center mb-20"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <span className="text-sky-600 font-medium tracking-wider text-sm uppercase mb-4 block">Our Strengths</span>
            <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-sky-800 to-gray-900 bg-clip-text text-transparent">
              Why Choose Studio Patsons?
            </h2>
            <div className="w-24 h-1 bg-sky-600 mx-auto mb-6"></div>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              We combine innovation with tradition to deliver exceptional quality and service in the fashion industry.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                className="group relative"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
                viewport={{ once: true }}
              >
                <div className="bg-white rounded-2xl p-8 shadow-[0_4px_20px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] transition-all duration-300 relative overflow-hidden border border-gray-100 h-full">
                  {/* Accent Corner */}
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-sky-500/20 to-indigo-500/20 rounded-bl-[100px] transition-transform duration-300 group-hover:scale-125" />
                  
                  {/* Icon Container */}
                  <div className="relative mb-6">
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-sky-100 to-indigo-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <span className="text-3xl">{feature.icon}</span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="relative">
                    <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-sky-900 to-indigo-900 bg-clip-text text-transparent">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>

                 
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Clients Section */}
      <div className="bg-gradient-to-b from-gray-50 to-white py-24 relative overflow-hidden">
        {/* Background Design Elements */}
        <div className="absolute inset-0 opacity-[0.03]">
          <div className="absolute top-0 left-0 w-96 h-96 bg-sky-600 rounded-full -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-600 rounded-full translate-x-1/2 translate-y-1/2" />
        </div>

        <div className="max-w-7xl mx-auto px-4 relative">
          <motion.div 
            className="text-center mb-20"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <span className="text-sky-600 font-medium tracking-wider text-sm uppercase mb-4 block">Global Partnerships</span>
            <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-sky-800 to-gray-900 bg-clip-text text-transparent">Our Esteemed Clients</h2>
            <div className="w-24 h-1 bg-sky-600 mx-auto mb-6"></div>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              We're proud to collaborate with industry leaders who trust us to deliver excellence in every project.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative">
            {clients.map((client, index) => (
              <motion.div
                key={client.name}
                className="group"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
              >
                <div className="bg-white rounded-2xl p-8 shadow-[0_4px_20px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] transition-all duration-300 relative overflow-hidden border border-gray-100">
                  {/* Accent Corner */}
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-sky-500/20 to-indigo-500/20 rounded-bl-[100px] transition-transform duration-300 group-hover:scale-125" />
                  
                  {/* Logo Area */}
                  <div className="relative mb-8">
                    <div className="h-16 flex items-center justify-start">
                      <span className="text-3xl font-bold bg-gradient-to-r from-sky-600 to-indigo-600 bg-clip-text text-transparent">
                        {client.name.split(' ')[0]}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 mt-2">
                      <CheckCircleIcon className="h-5 w-5 text-sky-600" />
                      <span className="text-sm font-medium text-sky-600">Premium Partner</span>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-sky-50 flex items-center justify-center">
                        <svg className="w-5 h-5 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Region</p>
                        <p className="font-medium">{client.name.includes('UK') ? 'United Kingdom' : 
                                                   client.name.includes('Germany') ? 'Germany' :
                                                   client.name.includes('Canada') ? 'Canada' :
                                                   client.name.includes('Slovakia') ? 'Slovakia' : 'Global'}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-sky-50 flex items-center justify-center">
                        <svg className="w-5 h-5 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Partnership Duration</p>
                        <p className="font-medium">Since 2016</p>
                      </div>
                    </div>
                  </div>

                  
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            className="text-center mt-20"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <button className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-sky-600 to-indigo-600 text-white font-medium rounded-xl hover:shadow-lg hover:shadow-sky-500/25 transition-all duration-300 transform hover:-translate-y-1">
              <span>Become Our Partner</span>
              <svg className="w-5 h-5 ml-2 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
          </motion.div>
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