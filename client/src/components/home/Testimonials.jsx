import { FiMessageSquare } from "react-icons/fi";

const Testimonials = () => {
  const reviews = [
    { name: "Rahul Sharma", role: "Cafe Owner", text: "LocalFinder helped me double my weekend customers. The table booking feature is a game changer!" },
    { name: "Priya Singh", role: "User", text: "Finally found a plumber who actually came on time. The tracking feature is amazing." },
    { name: "Amit Verma", role: "Freelancer", text: "Listing my services here was the best decision. I get 5-10 inquiries daily." }
  ];

  return (
    <section className="py-20 bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
           <h2 className="text-3xl font-bold">What people are saying</h2>
           <p className="text-slate-400 mt-2">Stories from our community</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((rev, i) => (
            <div key={i} className="bg-slate-800 p-8 rounded-2xl relative">
              <FiMessageSquare className="text-4xl text-indigo-500 opacity-20 absolute top-6 right-6"/>
              <p className="text-slate-300 italic mb-6">"{rev.text}"</p>
              <div>
                <h4 className="font-bold">{rev.name}</h4>
                <span className="text-xs text-indigo-400 uppercase tracking-widest">{rev.role}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;