"use client";

import { motion, type Variants } from "framer-motion";

import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "./accordion";

const containerVariants: Variants = {
	hidden: {},
	show: {
		transition: { staggerChildren: 0.06, delayChildren: 0.1 },
	},
};

const itemVariants: Variants = {
	hidden: { opacity: 0, y: 12 },
	show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
};

export function FaqsSection() {
	return (
		<div className="mx-auto w-full max-w-2xl mt-10 space-y-7 px-4">
			<motion.div
				initial={{ opacity: 0, y: 16 }}
				whileInView={{ opacity: 1, y: 0 }}
				viewport={{ once: true, amount: 0.5 }}
				transition={{ duration: 0.5, ease: "easeOut" }}
				className="space-y-2"
			>
				<h2 className="font-semibold text-3xl md:text-4xl">
					Frequently Asked Questions
				</h2>
				<p className="max-w-2xl text-muted-foreground">
					Have questions about learning with Edvra? Find answers to common questions about courses, enrollment, progress, and more. If you still need help, we're here for you.
				</p>
			</motion.div>

			<motion.div
				variants={containerVariants}
				initial="hidden"
				whileInView="show"
				viewport={{ once: true, amount: 0.2 }}
			>
				<Accordion type="single" collapsible className="rounded-3xl border">
					{questions.map((item) => (
						<motion.div key={item.id} variants={itemVariants}>
							<AccordionItem className="px-4" value={item.id}>
								<AccordionTrigger className="py-4 hover:no-underline focus-visible:underline focus-visible:ring-0">
									{item.title}
								</AccordionTrigger>
								<AccordionContent className="pb-4! text-muted-foreground">
									{item.content}
								</AccordionContent>
							</AccordionItem>
						</motion.div>
					))}
				</Accordion>
			</motion.div>

			<motion.p
				initial={{ opacity: 0 }}
				whileInView={{ opacity: 1 }}
				viewport={{ once: true, amount: 0.5 }}
				transition={{ duration: 0.4, ease: "easeOut", delay: 0.15 }}
				className="text-muted-foreground"
			>
				Can't find what you're looking for? Contact our{" "}
				<a className="text-primary hover:underline" href="/contact">
					customer support team
				</a>
			</motion.p>
		</div>
	);
}

const questions = [
  {
    id: "item-1",
    title: "What is Edvra?",
    content:
      "Edvra is an online learning platform designed to help students discover courses, build new skills, and learn at their own pace through structured lessons and learning resources.",
  },
  {
    id: "item-2",
    title: "Who can learn on Edvra?",
    content:
      "Edvra is built for anyone who wants to learn new skills or deepen their knowledge. Whether you're a student, beginner, or professional, you can explore courses that match your learning goals.",
  },
  {
    id: "item-3",
    title: "What types of courses are available?",
    content:
      "Edvra offers courses across areas such as web development, programming, cybersecurity, design, and other practical skills. New courses can be added as the platform grows.",
  },
  {
    id: "item-4",
    title: "How does learning on Edvra work?",
    content:
      "Choose a course, enroll, and work through its lessons at your own pace. Your progress is tracked as you complete lessons, making it easy to continue learning from where you left off.",
  },
  {
    id: "item-5",
    title: "Can I track my course progress?",
    content:
      "Yes. Edvra keeps track of your lesson and course progress so you can see how much you've completed and quickly continue where you stopped.",
  },
  {
    id: "item-6",
    title: "How do I enroll in a course?",
    content:
      "Browse the available courses from the Explore Courses page, select a course you're interested in, and follow the enrollment or checkout process. Once enrolled, the course becomes available in your learning dashboard.",
  },
  {
    id: "item-7",
    title: "Can I access my courses after enrolling?",
    content:
      "Yes. Once you're enrolled, you can access your courses from your My Learning dashboard and continue working through the available lessons.",
  },
  {
    id: "item-8",
    title: "How can I get help with Edvra?",
    content:
      "If you need help with your account, courses, enrollment, or payments, you can contact the Edvra team through the Contact Us page.",
  },
];