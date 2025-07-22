import { motion } from "framer-motion";

const variants = {
  hidden: { 
    opacity: 0,
    y: 40,
    x: 0, // Start off to the left
    rotate: -180 // Start rotated
  },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    x: 0, // Move to final x position
    rotate: 0, // Rotate to upright position
    transition: {
      delay: i * 0.3,
      duration: 0.8,
      ease: "backOut",
    },
  }),
};

const features = [
  {
    title: "Next-Gen\nIntuitive AI",
    img: "https://framerusercontent.com/images/9xBUeyjFoIl1FjZjmEgMoBq8.png",
  },
  {
    title: "Psychology\nPrinciples",
    img: "https://framerusercontent.com/images/2plMnSnXciHYjaUgXuUOaYpt6M.png",
  },
  {
    title: "Intelligent\nGuide",
    img: "https://framerusercontent.com/images/Qpxyys0BOfFuazuCStzK8cbjoZs.png",
  },
];

export default function AdvanceTechDesgin() {
  return (
    <div className="flex flex-col gap-12 px-20 py-20">
      {/* Text Section */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="flex flex-col space-y-6"
      >
        <h2 className="text-4xl font-bold text-gray-900 leading-tight font-ne">
          Advanced AI Technology <br />
          Designed to Support You
        </h2>
        <div className="flex gap-4 w-2xl">
          <p className="text-gray-700 text-[16px] font-normal leading-[150%]">
            Zofy leverages advanced deep learning and large language models to
            synthesize complex data, identifying success patterns with precision.
          </p>
          <p className="text-gray-700 text-lg">
            Zofy delivers personalized, actionable strategies rooted in
            psychology, behavioral science, and cutting-edge AI, guiding you
            seamlessly toward your goals.
          </p>
        </div>
      </motion.div>

      {/* Images Grid with Circular Animation */}
      <div className="flex justify-end gap-6">
        {features.map((item, i) => (
          <div key={i} className="flex flex-col items-center text-left">
            <motion.div
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={variants}
              className="w-48 h-48 rounded-lg overflow-hidden"
            >
              <img
                src={item.img}
                alt={item.title}
                className="w-full h-full object-contain"
              />
            </motion.div>
            {/* Stationary Text */}
            <p className="mt-4 text-lg font-medium whitespace-pre-line text-gray-800">
              {item.title}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}