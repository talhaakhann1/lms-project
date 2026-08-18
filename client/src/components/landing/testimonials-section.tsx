"use client"
import { FullWidthDivider } from "../../components/ui/full-width-divider";
import { QuoteIcon } from "lucide-react";
import { motion } from "framer-motion";
import { type Variants } from "framer-motion";

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            duration: 0.5,
            ease: "easeOut",
            staggerChildren: 0.12,
        },
    },
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 12 },
    show: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: "easeOut" },
    },
};

const cardVariants: Variants = {
    hidden: { opacity: 0, y: 12 },
    show: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: "easeOut" },
    },
};

type Testimonial = {
    quote: string;
    name: string;
    role: string;
    company?: string;
};

const testimonials: Testimonial[] = [
    {
        quote:
            "Edvra gives me a clear path from starting a course to actually completing it. The progress tracking keeps me motivated every step of the way.",
        name: "Ayesha Rahman",
        role: "Computer Science Student",
        company: "Edvra Student",
    },
    {
        quote:
            "Everything I need to learn is in one place. The interface is clean, the courses are easy to follow, and I never lose track of where I left off.",
        name: "Hamza Ahmed",
        role: "Web Development Student",
        company: "Edvra Student",
    },
    {
        quote:
            "What I like most about Edvra is the simplicity. I can discover a course, learn at my own pace, and see exactly how far I've progressed.",
        name: "Mariam Khan",
        role: "Software Engineering Student",
        company: "Edvra Student",
    },
];

export function TestimonialsSection() {
    return (
        <section id="testimonials" className="relative mx-auto w-full max-w-6xl">
            <motion.div
                className="mx-auto mb-10 flex max-w-md flex-col items-center justify-center gap-4 px-6 pt-20"
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                variants={containerVariants}
            >
                <motion.div className="flex justify-center" variants={itemVariants}>
                    <div className="flex items-center gap-2 rounded-lg border px-4 py-1">
                        <span
                            className="size-2 rounded-full bg-primary"
                            aria-hidden="true"
                        />
                        Testimonials
                    </div>
                </motion.div>

                <motion.h2
                    className="font-bold text-3xl tracking-tight lg:text-4xl"
                    variants={itemVariants}
                >
                    What our learners say
                </motion.h2>

                <motion.p
                    className="text-center text-muted-foreground text-sm"
                    variants={itemVariants}
                >
                    See how Edvra is helping learners build skills, stay motivated, and reach
  their learning goals.
                </motion.p>
            </motion.div>

            <FullWidthDivider />

            <motion.div
                className="grid md:grid-cols-[2fr_1px_1fr]"
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                variants={containerVariants}
            >
                <div className="divide-y">
                    {testimonials.slice(0, 2).map((testimonial) => (
                        <motion.div
                            key={testimonial.name}
                            variants={cardVariants}
                            whileHover={{ y: -3, scale: 1.02 }}
                            transition={{ duration: 0.4, ease: "easeOut" }}
                        >
                            <TestimonialCard testimonial={testimonial} />
                        </motion.div>
                    ))}
                </div>

                <div className="h-px bg-border md:h-auto" />

                <motion.div
                    className="flex items-center"
                    variants={cardVariants}
                    whileHover={{ y: -3, scale: 1.02 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                >
                    <TestimonialCard
                        testimonial={testimonials[2] as Testimonial}
                    />
                </motion.div>
            </motion.div>

            <FullWidthDivider />
        </section>
    );
}

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
    const { quote, name, role, company } = testimonial;

    return (
        <figure className="p-6 md:p-8">
            <QuoteIcon aria-hidden="true" className="mb-4 size-12 stroke-1 text-muted-foreground" />

            <blockquote className="mb-6 font-normal text-base text-foreground md:text-lg">
                &quot;{quote}&quot;
            </blockquote>

            <figcaption className="flex flex-col gap-0.5">
                <cite className="font-medium text-foreground text-lg not-italic">
                    {name}
                </cite>
                <p className="text-muted-foreground text-sm">
                    {role}
                    {company && `, ${company}`}
                </p>
            </figcaption>
        </figure>
    );
}
