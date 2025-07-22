import React from "react";

const blogPosts = [
  {
    title: "How to Reframe Negative Thoughts and Cultivate Optimism",
    date: "Jan 10, 2025",
    readTime: "10 MIN READ",
    image:
      "https://framerusercontent.com/images/mHOsbFjmOUi0JFg6tHOWYtD8ww.jpg",
    author: "Gabriela Baketarić",
    link: "/cms/blog/how-to-reframe-negative-thoughts-and-cultivate-optimism",
  },
  {
    title: "10 Simple Techniques to Improve Your Sleep Quality",
    date: "Jan 7, 2025",
    readTime: "7 MIN READ",
    image:
      "https://framerusercontent.com/images/VwfkkHzVR0oJVeIEOwIfjlSlcM.png?scale-down-to=1024",
    author: "Gabriela Baketarić",
    link: "/cms/blog/10-simple-techniques-to-improve-your-sleep-quality",
  },
  {
    title: "The Power of Mindfulness: A Guide for Beginners",
    date: "Jan 3, 2025",
    readTime: "8 MIN READ",
    image:
      "https://framerusercontent.com/images/MEab7ptT6yXc62ewm2Dk0ambYcs.png?scale-down-to=1024",
    author: "Gabriela Baketarić",
    link: "/cms/blog/the-power-of-mindfulness-a-guide-for-beginners",
  },
];

export default function InsightsSection() {
  return (
    <section className="w-full py-20 px-4 bg-black bg-opacity-70 text-white">
      <div className=" flex flex-col gap-10">
        {/* Header */}
        <div className="space-y-2">
          <p className="text-sm text-gray-200 uppercase tracking-wider">INSIGHTS</p>
          <h2 className="text-3xl sm:text-4xl font-semibold">
            Advanced AI Technology Designed to Support You
          </h2>
        </div>

        {/* Blog Cards */}
        <div className="flex  gap-5 ">
          {blogPosts.map((post, idx) => (
            <a
              href={post.link}
              key={idx}
              className="flex flex-col h-full group border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition"
            >
              <img
                src={post.image}
                alt={post.title}
                className="w-[100vh] h-[40vh] object-cover"
              />
              <div className="flex flex-col gap-2 p-4 flex-grow">
                <div className="flex gap-2 text-xs text-gray-200 font-medium">
                  <span>INSIGHT</span>
                  <span>•</span>
                  <span>{post.readTime}</span>
                  <span>•</span>
                  <span>{post.date}</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-200 group-hover:underline">
                  {post.title}
                </h3>
                <div className="mt-auto text-sm text-gray-200">
                  {post.author}
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
