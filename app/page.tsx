'use server';

import Link from 'next/link';
import { Button } from '@mui/material';

export default async function LandingPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-16">
        <section className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6 text-blue-800">AI Meal Planning</h1>
          <p className="text-xl mb-8 max-w-3xl mx-auto text-gray-600">
            Create personalized meal plans with the help of artificial intelligence. Our application
            will help you prepare delicious and healthy meals every day.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/auth/login">
              <Button variant="contained" color="primary" className="py-3 px-6">
                Log In
              </Button>
            </Link>
            <Link href="/auth/register">
              <Button variant="outlined" color="primary" className="py-3 px-6">
                Register
              </Button>
            </Link>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6 text-center text-blue-700">Our Benefits</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Personalized Plans',
                description:
                  'Create meal plans tailored to your preferences and dietary restrictions',
              },
              {
                title: 'AI Assistant',
                description:
                  'Get recommendations from a smart assistant that learns from your preferences',
              },
              {
                title: 'Time Saving',
                description: 'No more time wasted on meal planning and creating shopping lists',
              },
            ].map((feature, i) => (
              <div key={i} className="p-6 bg-white rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-3 text-blue-600">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="text-center">
          <h2 className="text-3xl font-bold mb-6 text-blue-700">Ready to Start?</h2>
          <Link href="/auth/register">
            <Button variant="contained" color="primary" size="large" className="py-3 px-8">
              Create a Free Account
            </Button>
          </Link>
        </section>
      </div>
    </main>
  );
}
