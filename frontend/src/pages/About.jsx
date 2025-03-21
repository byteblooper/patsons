import { motion } from 'framer-motion';
import { 
  CheckCircleIcon, 
  ShieldCheckIcon, 
  GlobeAltIcon, 
  UserGroupIcon, 
  BuildingOffice2Icon, 
  MapPinIcon,
  ChartBarIcon,
  UsersIcon,
  TrophyIcon
} from '@heroicons/react/24/outline';

function About() {
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const clients = [
    { name: 'New Look', region: 'UK & Germany' },
    { name: 'Peacocks', region: 'UK' },
    { name: 'JD Williams', region: 'UK' },
    { name: 'Missguided', region: 'UK' },
    { name: 'Suzy Shier', region: 'Canada' },
    { name: 'Gate sa', region: 'Slovakia' }
  ];

  const features = [
    {
      title: 'Sourcing the Best Quality Apparel',
      description: 'Our main concern is to source the finest quality fabric to ensure our customers the ultimate satisfying experience.',
      icon: <ShieldCheckIcon className="w-8 h-8 text-sky-600" />,
      stats: '100%',
      statsLabel: 'Quality Focus'
    },
    {
      title: 'Most Competitive Pricing',
      description: 'We always consider affordability to create a unique experience for our customers. We believe in the most competitive pricing.',
      icon: <GlobeAltIcon className="w-8 h-8 text-sky-600" />,
      stats: 'Best',
      statsLabel: 'Value'
    },
    {
      title: 'Professional Working Environment',
      description: 'Studio Patsons is excelling in the sourcing trade and the professional working environment is one of our many core values.',
      icon: <UserGroupIcon className="w-8 h-8 text-sky-600" />,
      stats: '7+',
      statsLabel: 'Years Experience'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section - Enhanced */}
      <div className="relative h-[80vh] bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-sky-600/20 to-indigo-600/20" />
          <img
            src="https://images.unsplash.com/photo-1732257119998-b66cda63dcfc?q=80&w=1930&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop"
            alt="Clothing Rack"
            className="w-full h-full object-cover opacity-30"
          />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4">
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.span 
              className="inline-block px-4 py-1 rounded-full bg-sky-600/20 text-sky-300 text-sm font-medium mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Welcome to Studio Patsons Limited
            </motion.span>
            <motion.h1 
              className="text-5xl md:text-7xl font-bold mb-8 text-white leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Crafting Excellence in<br />Global Fashion
            </motion.h1>
            <motion.p 
              className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Your trusted partner in premium apparel sourcing, delivering innovation and quality since 2016.
            </motion.p>
          </motion.div>
        </div>
      </div>

      {/* Quick Stats Section - New */}
      <div className="bg-white py-12 -mt-20 relative z-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-xl p-8 grid grid-cols-2 md:grid-cols-4 gap-8">
            <motion.div 
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <ChartBarIcon className="w-8 h-8 text-sky-600 mx-auto mb-4" />
              <p className="text-3xl font-bold text-gray-900 mb-2">7+</p>
              <p className="text-sm text-gray-600">Years of Excellence</p>
            </motion.div>
            <motion.div 
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <UsersIcon className="w-8 h-8 text-sky-600 mx-auto mb-4" />
              <p className="text-3xl font-bold text-gray-900 mb-2">50+</p>
              <p className="text-sm text-gray-600">Global Partners</p>
            </motion.div>
            <motion.div 
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <TrophyIcon className="w-8 h-8 text-sky-600 mx-auto mb-4" />
              <p className="text-3xl font-bold text-gray-900 mb-2">100%</p>
              <p className="text-sm text-gray-600">Quality Focus</p>
            </motion.div>
            <motion.div 
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <GlobeAltIcon className="w-8 h-8 text-sky-600 mx-auto mb-4" />
              <p className="text-3xl font-bold text-gray-900 mb-2">4+</p>
              <p className="text-sm text-gray-600">Countries Served</p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Mission & Vision Section - Enhanced */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-16">
            {/* Mission Section */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <div className="inline-flex items-center space-x-2 bg-sky-50 rounded-full px-4 py-1">
                <span className="w-2 h-2 rounded-full bg-sky-600"></span>
                <span className="text-sky-600 font-medium text-sm">Our Mission</span>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 leading-tight">
                Total Customer Satisfaction Through Quality & Value
              </h2>
              <p className="text-gray-600 leading-relaxed">
                Our mission is to provide total customer satisfaction by offering a range of quality garments at reasonable prices. 
                We satisfy our buyers as well as other regulatory requirements ensuring to provide quality service and products.
              </p>
              <div className="pt-4 space-y-4">
                {[
                  'Quality-focused approach',
                  'Competitive pricing strategy',
                  'Professional service delivery'
                ].map((item, index) => (
                  <div key={index} className="flex items-center space-x-3 bg-gray-50 p-3 rounded-lg">
                    <CheckCircleIcon className="w-5 h-5 text-sky-600 flex-shrink-0" />
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Vision Section */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <div className="inline-flex items-center space-x-2 bg-indigo-50 rounded-full px-4 py-1">
                <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
                <span className="text-indigo-600 font-medium text-sm">Our Vision</span>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 leading-tight">
                Leading the Future of Apparel Sourcing
              </h2>
              <p className="text-gray-600 leading-relaxed">
                Studio Patsons is a fast-growing apparel R&D, merchandising & sourcing company from Bangladesh. 
                Throughout the years, we have established ourselves as a core manufacture partner for fashion brands in Europe and U.S.A.
              </p>
              <div className="grid grid-cols-2 gap-6 pt-4">
                <div className="bg-gradient-to-br from-sky-50 to-indigo-50 p-6 rounded-xl">
                  <p className="text-3xl font-bold text-sky-600">7+</p>
                  <p className="text-sm text-gray-600 mt-1">Years Experience</p>
                </div>
                <div className="bg-gradient-to-br from-sky-50 to-indigo-50 p-6 rounded-xl">
                  <p className="text-3xl font-bold text-indigo-600">100%</p>
                  <p className="text-sm text-gray-600 mt-1">Customer Focus</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Services Overview - Enhanced */}
      <div className="bg-gradient-to-b from-gray-50 to-white py-20">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center"
          >
            <span className="inline-block px-4 py-1 rounded-full bg-sky-50 text-sky-600 text-sm font-medium mb-6">
              Our Services
            </span>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Comprehensive Sourcing Solutions
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              Our services include all that a buyer needs for successful buying. With seven years of experience in dealing with all categories of garments, 
              we aim to be your trusted partner in the garments industry.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Why Choose Us Section */}
      <div className="py-24 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
        {/* Background Design Elements */}
        <div className="absolute inset-0 opacity-[0.03]">
          <div className="absolute top-0 left-0 w-96 h-96 bg-sky-600 rounded-full -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-600 rounded-full translate-x-1/2 translate-y-1/2" />
        </div>

        <div className="max-w-7xl mx-auto px-4 relative">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <span className="text-sky-600 font-medium tracking-wider text-sm uppercase mb-4 block">Why Choose Us</span>
            <h2 className="text-4xl font-bold mb-6 text-gray-900">
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
                className="group"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
                viewport={{ once: true }}
              >
                <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 relative overflow-hidden border border-gray-100 h-full">
                  {/* Feature Number */}
                  <div className="absolute top-6 right-6 text-4xl font-bold text-gray-100">
                    0{index + 1}
                  </div>

                  {/* Icon and Content */}
                  <div className="relative">
                    <div className="mb-6">
                      <div className="w-14 h-14 rounded-lg bg-sky-50 flex items-center justify-center group-hover:bg-sky-100 transition-colors duration-300">
                        {feature.icon}
                      </div>
                    </div>

                    <h3 className="text-xl font-bold mb-4 text-gray-900">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {feature.description}
                    </p>

                    {/* Feature Highlight */}
                    <div className="mt-6 pt-6 border-t border-gray-100">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">{feature.statsLabel}</span>
                        <span className="text-xl font-bold text-sky-600">{feature.stats}</span>
                      </div>
                    </div>
                  </div>

                  {/* Decorative Corner */}
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-sky-500/10 to-indigo-500/10 rounded-bl-[100px] transition-transform duration-300 group-hover:scale-110" />
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
                <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 relative overflow-hidden border border-gray-100">
                  {/* Company Badge */}
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">
                        {client.name}
                      </h3>
                      <div className="flex items-center mt-2">
                        <CheckCircleIcon className="h-5 w-5 text-sky-600" />
                        <span className="text-sm font-medium text-sky-600 ml-2">Verified Partner</span>
                      </div>
                    </div>
                    <div className="bg-sky-50 p-3 rounded-full">
                      <BuildingOffice2Icon className="w-6 h-6 text-sky-600" />
                    </div>
                  </div>

                  {/* Region */}
                  <div className="flex items-center text-gray-500 mt-4">
                    <MapPinIcon className="w-5 h-5 mr-2" />
                    <span className="text-sm font-medium text-gray-900">{client.region}</span>
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

      {/* Footer Quote - Enhanced */}
      <div className="py-24 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <motion.div
            className="text-center space-y-6"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <span className="inline-block w-20 h-1 bg-sky-600"></span>
            <p className="text-2xl text-gray-600 italic font-light leading-relaxed">
              "With seven years of experience, Studio Patsons Limited stands as a fast-growing apparel R&D, merchandising, and sourcing company. 
              We are more than a buying house; we are a strategic partner dedicated to delivering excellence in every stitch."
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default About;