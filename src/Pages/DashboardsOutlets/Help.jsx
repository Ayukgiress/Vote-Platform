import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, Search, MessageCircle, Book, Video, Mail, Sparkles, Zap, LifeBuoy, ExternalLink, Star } from 'lucide-react';

const Help = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedFAQ, setExpandedFAQ] = useState(null);

  const faqs = [
    {
      question: 'How do I create a new contest?',
      answer: 'To create a new contest, go to the Overview page and click the "Create Contest" button. Fill in the contest details including name, description, start and end dates, then add contestants to get started.',
      category: 'Getting Started'
    },
    {
      question: 'How do I publish a contest?',
      answer: 'Once your contest has at least one contestant, you can publish it by clicking the "Publish" button on the contest card. Published contests become visible to voters through their unique voting URL.',
      category: 'Contest Management'
    },
    {
      question: 'Can I edit a contest after it\'s published?',
      answer: 'You can edit basic contest information, but you cannot modify contestants or voting settings after publication. For major changes, consider creating a new contest.',
      category: 'Contest Management'
    },
    {
      question: 'How do voters access the contest?',
      answer: 'After publishing, each contest gets a unique voting URL (e.g., yoursite.com/contest-id/vote). Share this URL with your audience to allow them to vote.',
      category: 'Voting'
    },
    {
      question: 'What happens when a contest ends?',
      answer: 'When the end date passes, voting is automatically disabled. Winners are calculated based on the highest number of votes. You can view results on the contest card.',
      category: 'Results & Analytics'
    },
    {
      question: 'Can I export contest data?',
      answer: 'Yes, you can export analytics data from the Analytics page. Click the "Export" button to download a CSV file with your contest statistics.',
      category: 'Results & Analytics'
    },
    {
      question: 'How do I add contestants to a contest?',
      answer: 'On the contest card, click "Add Contestant". Upload contestant photos and enter their names. You can add multiple contestants before publishing.',
      category: 'Contest Management'
    },
    {
      question: 'Is there a limit to the number of contests I can create?',
      answer: 'There are no hard limits on the number of contests you can create. However, we recommend keeping your active contests manageable for optimal performance.',
      category: 'Account & Limits'
    }
  ];

  const filteredFAQs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleFAQ = (index) => {
    setExpandedFAQ(expandedFAQ === index ? null : index);
  };

  const quickActions = [
    {
      icon: <Book className="h-6 w-6" />,
      title: 'Documentation',
      description: 'Complete user guide and API documentation',
      action: () => window.open('https://docs.Choosify.com', '_blank'),
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      icon: <Video className="h-6 w-6" />,
      title: 'Video Tutorials',
      description: 'Step-by-step video guides for common tasks',
      action: () => window.open('https://youtube.com/Choosify', '_blank'),
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      icon: <MessageCircle className="h-6 w-6" />,
      title: 'Community Forum',
      description: 'Get help from other users and experts',
      action: () => window.open('https://community.Choosify.com', '_blank'),
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50'
    },
    {
      icon: <Mail className="h-6 w-6" />,
      title: 'Contact Support',
      description: 'Send us a message for personalized help',
      action: () => window.location.href = 'mailto:support@Choosify.com',
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50'
    }
  ];

  const categories = [...new Set(faqs.map(faq => faq.category))];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 p-6">
      <div className="w-full mx-auto space-y-8">
        {/* Header */}
        {/* <div className="text-center space-y-6">
          <div className="relative inline-block">
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl w-24 h-24 mx-auto flex items-center justify-center shadow-xl">
              <HelpCircle className="h-10 w-10 text-white" />
            </div>
            <Sparkles className="h-6 w-6 text-yellow-400 absolute -top-2 -right-2 animate-pulse" />
          </div>
          <div className="space-y-3">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-900 to-blue-800 bg-clip-text text-transparent">
              Help Center
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Everything you need to know about Choosify. Find answers, watch tutorials, and get support.
            </p>
          </div>
        </div> */}

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.map((action, index) => (
            <div
              key={index}
              onClick={action.action}
              className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 p-6 cursor-pointer hover:-translate-y-2 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-transparent to-gray-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="relative z-10">
                <div className={`p-3 rounded-xl ${action.bgColor} w-fit mb-4 transform group-hover:scale-110 transition-transform duration-300`}>
                  <div className={`text-white bg-gradient-to-br ${action.color} rounded-lg p-2`}>
                    {action.icon}
                  </div>
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-2 group-hover:text-gray-800 transition-colors">
                  {action.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-3">
                  {action.description}
                </p>
                <div className="flex items-center gap-1 text-sm text-gray-500 group-hover:text-gray-700 transition-colors">
                  <span>Learn more</span>
                  <ExternalLink className="h-4 w-4" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Search Section */}
        <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 p-8">
          <div className="max-w-2xl mx-auto text-center space-y-4">
            <div className="flex items-center justify-center gap-2 text-gray-600 mb-4">
              <Zap className="h-5 w-5 text-yellow-500" />
              <span className="text-sm font-medium">Popular: Contest Creation, Voting Setup, Results</span>
            </div>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search help articles, FAQs, and guides..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg shadow-sm hover:shadow-md transition-shadow duration-200"
              />
            </div>
            {searchTerm && (
              <p className="text-sm text-gray-500">
                {filteredFAQs.length} result{filteredFAQs.length !== 1 ? 's' : ''} found
              </p>
            )}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 p-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-blue-50 rounded-lg">
              <LifeBuoy className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Frequently Asked Questions</h2>
              <p className="text-gray-600 mt-1">Quick answers to common questions</p>
            </div>
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-3 mb-8">
            <button
              onClick={() => setSearchTerm('')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                searchTerm === '' 
                  ? 'bg-blue-500 text-white shadow-lg' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All Categories
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSearchTerm(category)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  searchTerm === category
                    ? 'bg-blue-500 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* FAQ List */}
          <div className="space-y-4">
            {filteredFAQs.map((faq, index) => (
              <div 
                key={index} 
                className="border border-gray-200 rounded-xl hover:border-gray-300 transition-all duration-200 overflow-hidden group"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-6 py-5 text-left flex items-center justify-between hover:bg-gray-50 transition-colors duration-200 group"
                >
                  <div className="flex items-start gap-4 flex-1">
                    <div className="bg-blue-50 p-2 rounded-lg mt-1 group-hover:bg-blue-100 transition-colors">
                      <HelpCircle className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="text-left flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <span className="font-semibold text-gray-900 text-lg group-hover:text-blue-600 transition-colors">
                          {faq.question}
                        </span>
                        <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full font-medium">
                          {faq.category}
                        </span>
                      </div>
                      {expandedFAQ !== index && (
                        <p className="text-gray-600 text-sm line-clamp-1">
                          {faq.answer}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="ml-4 flex-shrink-0">
                    {expandedFAQ === index ? (
                      <ChevronUp className="h-5 w-5 text-gray-500 transform group-hover:scale-110 transition-transform" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-gray-500 transform group-hover:scale-110 transition-transform" />
                    )}
                  </div>
                </button>
                {expandedFAQ === index && (
                  <div className="px-6 pb-5 ml-12 border-t border-gray-100 pt-4">
                    <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {filteredFAQs.length === 0 && (
            <div className="text-center py-12">
              <div className="bg-gray-50 rounded-2xl p-8 max-w-md mx-auto">
                <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No results found</h3>
                <p className="text-gray-600">
                  Try adjusting your search terms or browse the categories above.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Contact Support */}
        <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 rounded-2xl p-10 text-white text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
          <div className="relative z-10">
            <div className="flex justify-center mb-4">
              <div className="bg-white/20 backdrop-blur-sm rounded-full p-4">
                <MessageCircle className="h-8 w-8 text-white" />
              </div>
            </div>
            <h2 className="text-3xl font-bold mb-4">Still need help?</h2>
            <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto leading-relaxed">
              Our support team is ready to assist you with any questions or issues you might have.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={() => window.location.href = 'mailto:support@Choosify.com'}
                className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center gap-3"
              >
                <Mail className="h-5 w-5" />
                Email Support Team
              </button>
              <button
                onClick={() => window.open('https://community.Choosify.com', '_blank')}
                className="bg-blue-500 hover:bg-blue-400 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center gap-3 border border-blue-400"
              >
                <MessageCircle className="h-5 w-5" />
                Ask Community
              </button>
            </div>
            <div className="flex items-center justify-center gap-6 mt-8 text-blue-200 text-sm">
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 fill-current" />
                <span>24/7 Support</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 fill-current" />
                <span>Quick Response</span>
              </div>
              <div className="flex items-center gap-2">
                <HelpCircle className="h-4 w-4 fill-current" />
                <span>Expert Help</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Help;