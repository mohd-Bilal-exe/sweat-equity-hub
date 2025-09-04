import { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Mail, MessageSquare, Users } from 'lucide-react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Form submitted:', formData);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="bg-white min-h-screen text-gray-800">
      {/* Hero Section */}
      <section className="bg-gray-50 px-4 sm:px-6 lg:px-8 py-20">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="mb-6 font-bold text-gray-900 text-4xl md:text-6xl">
            Get in Touch
          </h1>
          <p className="mx-auto mb-8 max-w-3xl text-gray-600 text-xl">
            Have questions about sweatquity? Want to partner with us? We'd love to hear from you.
            Reach out and let's build something amazing together.
          </p>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="px-4 sm:px-6 lg:px-8 py-24">
        <div className="mx-auto max-w-4xl">
          <div className="gap-12 grid grid-cols-1 lg:grid-cols-2">
            {/* Contact Form */}
            <Card className="bg-white shadow-sm border">
              <CardContent className="p-8">
                <h2 className="mb-6 font-bold text-gray-900 text-2xl">Send us a Message</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      name="message"
                      rows={6}
                      value={formData.message}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <Button type="submit" size="lg" className="w-full">
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Contact Info */}
            <div className="space-y-8">
              <div>
                <h2 className="mb-6 font-bold text-gray-900 text-2xl">Other Ways to Reach Us</h2>
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <Mail className="mt-1 w-6 h-6 text-indigo-600" />
                    <div>
                      <h3 className="font-semibold text-gray-900">Email Support</h3>
                      <p className="text-gray-600">app@base44.com</p>
                      <p className="text-gray-500 text-sm">We typically respond within 24 hours</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <Users className="mt-1 w-6 h-6 text-indigo-600" />
                    <div>
                      <h3 className="font-semibold text-gray-900">For Employers</h3>
                      <p className="text-gray-600">Questions about posting jobs or partnerships</p>
                      <p className="text-gray-500 text-sm">Let's discuss how we can help you find talent</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <MessageSquare className="mt-1 w-6 h-6 text-indigo-600" />
                    <div>
                      <h3 className="font-semibold text-gray-900">For Talent</h3>
                      <p className="text-gray-600">Need help with your profile or applications?</p>
                      <p className="text-gray-500 text-sm">We're here to support your equity journey</p>
                    </div>
                  </div>
                </div>
              </div>

              <Card className="bg-gray-50 border-gray-200">
                <CardContent className="p-6">
                  <h3 className="mb-3 font-semibold text-gray-900">Quick Links</h3>
                  <div className="space-y-2">
                    <Link to={createPageUrl('About')} className="block text-indigo-600 hover:text-indigo-800">
                      Learn more about our mission
                    </Link>
                    <Link to={createPageUrl('Home')} className="block text-indigo-600 hover:text-indigo-800">
                      Browse equity opportunities
                    </Link>
                    <Link to={createPageUrl('PostJob')} className="block text-indigo-600 hover:text-indigo-800">
                      Post a job with equity
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-gray-100 px-4 sm:px-6 lg:px-8 py-20">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-4 font-bold text-gray-900 text-3xl">Ready to Get Started?</h2>
          <p className="mx-auto mb-8 max-w-2xl text-gray-600 text-xl">
            Don't wait - join the equity revolution today and start building your ownership stake.
          </p>
          <div className="flex sm:flex-row flex-col justify-center gap-4">
            <Button asChild size="lg">
              <Link to={createPageUrl('Home')}>Find Equity Jobs</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to={createPageUrl('PostJob')}>Hire with Equity</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}