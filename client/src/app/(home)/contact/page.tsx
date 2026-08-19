"use client";

import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, MotionConfig } from "framer-motion";
import type { Variants } from "framer-motion";
import {
  Mail,
  Phone,
  Clock,
  MapPin,
  HelpCircle,
  Loader2,
  Send,
} from "lucide-react";

import { Button } from "../../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import { Textarea } from "../../../components/ui/textarea";
import { Label } from "../../../components/ui/label";
import { Separator } from "../../../components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import { showSuccess, showError } from "../../../components/ui/toaster";


function FormItem({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-col gap-1.5">{children}</div>;
}

function FormLabel({
  children,
  htmlFor,
}: {
  children: React.ReactNode;
  htmlFor?: string;
}) {
  return (
    <Label htmlFor={htmlFor} className="text-sm font-medium text-foreground">
      {children}
    </Label>
  );
}

function FormMessage({ children }: { children?: React.ReactNode }) {
  if (!children) return null;
  return <p className="text-xs text-destructive">{children}</p>;
}

const inquiryTypes = [
  { value: "general", label: "General Question" },
  { value: "course", label: "Course Inquiry" },
  { value: "technical", label: "Technical Support" },
  { value: "payment", label: "Payment Issue" },
  { value: "instructor", label: "Instructor Support" },
  { value: "other", label: "Other" },
] as const;

const contactFormSchema = z.object({
  fullName: z
    .string()
    .min(2, "Full name is required.")
    .max(100, "Full name must be 100 characters or fewer."),
  email: z.string().min(1, "Email is required.").email("Enter a valid email address."),
  inquiryType: z.string().min(1, "Please select an inquiry type."),
  subject: z
    .string()
    .min(3, "Subject is required.")
    .max(150, "Subject must be 150 characters or fewer."),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters.")
    .max(2000, "Message must be 2000 characters or fewer."),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

const defaultValues: ContactFormValues = {
  fullName: "",
  email: "",
  inquiryType: "",
  subject: "",
  message: "",
};

const fadeUp: Variants =  {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const buttonHover = { scale: 1.02 };
const buttonTap = { scale: 0.97 };


const contactDetails = [
  { icon: Mail, label: "Email", value: "support@learnly.com" },
  { icon: Phone, label: "Phone", value: "+1 (555) 010-2938" },
  { icon: Clock, label: "Support Hours", value: "Mon–Fri, 9am–6pm EST" },
  { icon: MapPin, label: "Location", value: "Remote-first · San Francisco, CA" },
];


export default function ContactPage() {
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues,
  });

  const { errors, isSubmitting } = form.formState;

  async function onSubmit(data: ContactFormValues) {
    try {
 
      await new Promise((resolve) => setTimeout(resolve, 1200));
      console.log("Contact submission:", data);
      showSuccess(
        "Message sent",
        "Thanks for reaching out — we'll get back to you shortly."
      );
      form.reset(defaultValues);
    } catch {
      showError(
        "Something went wrong",
        "Your message couldn't be sent. Please try again."
      );
    }
  }

  return (
    <MotionConfig reducedMotion="user">
      <main className="mx-auto w-full mt-6 sm:mt-0 max-w-6xl px-6 py-16 sm:py-28 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] lg:gap-16">
       
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="flex flex-col gap-8"
          >
            <div className="space-y-3">
              <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Get in Touch
              </h1>
              <p className="text-base leading-relaxed text-muted-foreground">
                Have a question about a course, your account, or something
                else? Send us a message and our team will get back to you as
                soon as possible.
              </p>
            </div>

            <Separator />

            <ul className="flex flex-col gap-5">
              {contactDetails.map((detail) => (
                <li key={detail.label} className="flex items-start gap-3">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <detail.icon className="size-4.5" strokeWidth={1.75} />
                  </span>
                  <div className="space-y-0.5">
                    <p className="text-sm font-medium text-foreground">
                      {detail.label}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {detail.value}
                    </p>
                  </div>
                </li>
              ))}
            </ul>

            <Separator />

            <div className="flex items-start gap-3 rounded-xl border border-border bg-muted/40 p-4">
              <HelpCircle
                className="mt-0.5 size-4.5 shrink-0 text-muted-foreground"
                strokeWidth={1.75}
              />
              <p className="text-sm text-muted-foreground">
                Looking for quick answers? Check our{" "}
                <a href="/faq" className="font-medium text-primary hover:underline">
                  FAQ
                </a>{" "}
                before reaching out — you might find what you need right away.
              </p>
            </div>
          </motion.div>

          {/* Contact form */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            transition={{ delay: 0.1 }}
          >
            <Card className="rounded-2xl border-border shadow-md">
              <CardHeader className="space-y-1">
                <CardTitle className="text-xl font-bold text-foreground">
                  Send us a message
                </CardTitle>
                <CardDescription>
                  Fill out the form below and we'll respond within one
                  business day.
                </CardDescription>
              </CardHeader>

              <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
                <CardContent className="flex flex-col gap-5">
                
                  <Controller
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor="fullName">Full Name</FormLabel>
                        <Input
                          id="fullName"
                          placeholder="Jane Cooper"
                          aria-invalid={!!errors.fullName}
                          {...field}
                        />
                        <FormMessage>{errors.fullName?.message}</FormMessage>
                      </FormItem>
                    )}
                  />

                  <Controller
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor="email">Email</FormLabel>
                        <Input
                          id="email"
                          type="email"
                          placeholder="jane@example.com"
                          aria-invalid={!!errors.email}
                          {...field}
                        />
                        <FormMessage>{errors.email?.message}</FormMessage>
                      </FormItem>
                    )}
                  />

                  <Controller
                    control={form.control}
                    name="inquiryType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor="inquiryType">Inquiry Type</FormLabel>
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger id="inquiryType" aria-invalid={!!errors.inquiryType}>
                            <SelectValue placeholder="Select an inquiry type" />
                          </SelectTrigger>
                          <SelectContent>
                            {inquiryTypes.map((type) => (
                              <SelectItem key={type.value} value={type.value}>
                                {type.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage>{errors.inquiryType?.message}</FormMessage>
                      </FormItem>
                    )}
                  />

                  <Controller
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor="subject">Subject</FormLabel>
                        <Input
                          id="subject"
                          placeholder="How can we help?"
                          aria-invalid={!!errors.subject}
                          {...field}
                        />
                        <FormMessage>{errors.subject?.message}</FormMessage>
                      </FormItem>
                    )}
                  />

                  <Controller
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor="message">Message</FormLabel>
                        <Textarea
                          id="message"
                          placeholder="Tell us more about your question..."
                          className="min-h-32 resize-y"
                          aria-invalid={!!errors.message}
                          {...field}
                        />
                        <FormMessage>{errors.message?.message}</FormMessage>
                      </FormItem>
                    )}
                  />

                  <motion.div whileHover={buttonHover} whileTap={buttonTap}>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full sm:w-auto"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="size-4 animate-spin" strokeWidth={1.75} />
                          Sending…
                        </>
                      ) : (
                        <>
                          <Send className="size-4" strokeWidth={1.75} />
                          Send Message
                        </>
                      )}
                    </Button>
                  </motion.div>
                </CardContent>
              </form>
            </Card>
          </motion.div>
        </div>
      </main>
    </MotionConfig>
  );
}