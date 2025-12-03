"use client";

import React, { useState } from "react";

export type FormState = {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
};

export type Errors = Partial<Record<keyof FormState, string>>;

type ChangeEvt =
  | React.ChangeEvent<HTMLInputElement>
  | React.ChangeEvent<HTMLTextAreaElement>
  | React.ChangeEvent<HTMLSelectElement>;

export default function contactForm() {
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
  const phoneDigits = (s: string) => (s.match(/\d/g) || []).length;

  const validate = () => {
    const next: Errors = {};
    if (!form.name.trim()) next.name = "Please enter your name.";
    if (!form.email.trim()) next.email = "Please enter your email.";
    else if (!emailRegex.test(form.email))
      next.email = "Enter a valid email address.";

    if (form.phone && phoneDigits(form.phone) < 7)
      next.phone = "Enter a valid phone number (7+ digits).";

    if (!form.subject.trim()) next.subject = "Please choose a subject.";
    if (!form.message.trim() || form.message.trim().length < 10)
      next.message = "Message must be at least 10 characters.";

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleChange = (e: ChangeEvt) => {
    const { name, value } = e.target;
    // name is a string; assert it is a valid key
    const key = name as keyof FormState;

    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors((err) => ({ ...err, [key]: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    await new Promise((res) => setTimeout(res, 500));
    setSubmitted(true);
    setForm({ name: "", email: "", phone: "", subject: "", message: "" });
  };

  return { form, errors, submitted, handleChange, handleSubmit };
}
