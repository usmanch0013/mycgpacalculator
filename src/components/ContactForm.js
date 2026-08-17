"use client";

import { useState } from 'react';

const TOPICS = [
  'General question',
  'Report wrong grading scale',
  'Request new university',
  'Bug report',
  'Privacy / data question',
  'Partnership inquiry',
  'Other',
];

export default function ContactForm() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    topic: TOPICS[0],
    university: '',
    message: '',
  });
  const [status, setStatus] = useState('idle');
  const [successName, setSuccessName] = useState('');
  const [errors, setErrors] = useState({});

  const validate = () => {
    const next = {};
    if (!form.name.trim()) next.name = 'Please enter your name';
    if (!form.email.trim()) next.email = 'Please enter your email';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = 'Enter a valid email address';
    if (!form.message.trim()) next.message = 'Please write a message';
    else if (form.message.trim().length < 20) next.message = 'Message should be at least 20 characters';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    setStatus('sending');
    const sentName = form.name;
    setTimeout(() => {
      setStatus('success');
      setSuccessName(sentName);
      setForm({ name: '', email: '', topic: TOPICS[0], university: '', message: '' });
    }, 1200);
  };

  const update = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  if (status === 'success') {
    return (
      <div className="contact-form-card contact-success">
        <div className="contact-success-icon">✓</div>
        <h2>Message sent!</h2>
        <p>
          Thanks for reaching out{successName ? `, ${successName}` : ''}. We&apos;ll get back to you at your email within a few days.
        </p>
        <button type="button" className="btn btn-primary btn-sm" onClick={() => setStatus('idle')}>
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form className="contact-form-card" onSubmit={handleSubmit} noValidate>
      <h2 className="contact-form-title">Send us a message</h2>
      <p className="contact-form-desc">Fill in the form below and we&apos;ll respond as soon as we can.</p>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="name">Full name</label>
          <input
            id="name"
            type="text"
            className={`form-field ${errors.name ? 'form-field--error' : ''}`}
            placeholder="Your name"
            value={form.name}
            onChange={(e) => update('name', e.target.value)}
          />
          {errors.name && <span className="form-error">{errors.name}</span>}
        </div>
        <div className="form-group">
          <label htmlFor="email">Email address</label>
          <input
            id="email"
            type="email"
            className={`form-field ${errors.email ? 'form-field--error' : ''}`}
            placeholder="you@university.edu"
            value={form.email}
            onChange={(e) => update('email', e.target.value)}
          />
          {errors.email && <span className="form-error">{errors.email}</span>}
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="topic">Topic</label>
          <select
            id="topic"
            className="form-field form-select"
            value={form.topic}
            onChange={(e) => update('topic', e.target.value)}
          >
            {TOPICS.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="university">University (optional)</label>
          <input
            id="university"
            type="text"
            className="form-field"
            placeholder="e.g. BRAC University"
            value={form.university}
            onChange={(e) => update('university', e.target.value)}
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="message">Your message</label>
        <textarea
          id="message"
          className={`form-field form-textarea ${errors.message ? 'form-field--error' : ''}`}
          placeholder="Tell us what's on your mind — the more detail, the faster we can help."
          rows={6}
          value={form.message}
          onChange={(e) => update('message', e.target.value)}
        />
        {errors.message && <span className="form-error">{errors.message}</span>}
      </div>

      <div className="form-footer">
        <p className="form-privacy-note">
          By submitting, you agree we may use your email only to reply. See our{' '}
          <a href="/privacy">Privacy Policy</a>.
        </p>
        <button type="submit" className="btn btn-primary" disabled={status === 'sending'}>
          {status === 'sending' ? 'Sending…' : 'Send Message'}
        </button>
      </div>
    </form>
  );
}
