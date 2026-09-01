import React, { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ArrowRight, Check, MessageSquare, SkipForward } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';

type Field =
  | 'country'
  | 'role'
  | 'collaboration_types'
  | 'finding_opportunities'
  | 'process'
  | 'tools'
  | 'fell_through'
  | 'hardest_part'
  | 'issue_frequency'
  | 'discoverability'
  | 'values_most'
  | 'instant_yes'
  | 'trust_platforms'
  | 'trust_requirements'
  | 'paid_tools'
  | 'willing_to_pay'
  | 'one_change'
  | 'contact_email';

interface Question {
  field: Field;
  label: string;
  hint?: string;
  kind: 'short' | 'long' | 'options';
  options?: string[];
  placeholder?: string;
}

const QUESTIONS: Question[] = [
  { field: 'country', label: 'What country are you from?', kind: 'short', placeholder: 'e.g. United States' },
  {
    field: 'role',
    label: 'What do you do?',
    kind: 'options',
    options: ['Graphic Design', 'Artist', 'Videographer', 'Musician', 'Creative Director'],
    placeholder: 'Something else? Type it here',
  },
  {
    field: 'collaboration_types',
    label: 'What kinds of creative work or events do you usually do?',
    kind: 'long',
  },
  { field: 'finding_opportunities', label: 'How do you typically find paid opportunities or brand partnerships?', kind: 'long' },
  { field: 'process', label: 'What does your process look like from initial contact to final delivery?', kind: 'long' },
  { field: 'tools', label: 'What tools do you rely on for collaboration, communication, portfolio, and contracts?', kind: 'long' },
  { field: 'fell_through', label: 'Tell me about a recent opportunity that fell through. Why?', kind: 'long' },
  { field: 'hardest_part', label: "What's the hardest part about collaborating with brands or venues?", kind: 'long' },
  {
    field: 'issue_frequency',
    label: 'How often do you deal with unclear briefs, late payments, or disorganized communication?',
    kind: 'options',
    options: ['Almost never', 'Sometimes', 'Often', 'Constantly'],
  },
  {
    field: 'discoverability',
    label: 'Do you find it easy or difficult to stand out or get discovered?',
    kind: 'options',
    options: ['Easy', 'Manageable', 'Difficult', 'Nearly impossible'],
  },
  {
    field: 'values_most',
    label: 'What do you value most in collaborations?',
    hint: 'Creative freedom, money, exposure, long-term relationships…',
    kind: 'long',
  },
  { field: 'instant_yes', label: 'What would make you say yes to a collaboration immediately?', kind: 'long' },
  { field: 'trust_platforms', label: 'Do you trust platforms to connect you with brands/venues? Why or why not?', kind: 'long' },
  { field: 'trust_requirements', label: 'What would a platform need to have to earn your trust?', kind: 'long' },
  {
    field: 'paid_tools',
    label: 'Have you ever paid for a tool to find work, get exposure, or manage clients?',
    kind: 'long',
  },
  { field: 'willing_to_pay', label: 'What would make you willing to pay for or regularly use a platform?', kind: 'long' },
  { field: 'one_change', label: 'If you could change one thing about how you collaborate today, what would it be?', kind: 'long' },
  {
    field: 'contact_email',
    label: 'Want a follow-up? Drop your email (optional).',
    kind: 'short',
    placeholder: 'you@example.com',
  },
];

const FeedbackQuestionnaire: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [started, setStarted] = useState(false);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Partial<Record<Field, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const question = QUESTIONS[index];
  const progress = useMemo(() => Math.round((index / QUESTIONS.length) * 100), [index]);
  const answeredCount = Object.values(answers).filter((v) => v && v.trim()).length;

  const setAnswer = (value: string) => setAnswers((prev) => ({ ...prev, [question.field]: value }));

  const submit = async (payload: Partial<Record<Field, string>>) => {
    setSubmitting(true);
    const { role, ...rest } = payload;
    const known = QUESTIONS.find((q) => q.field === 'role')?.options ?? [];
    const isKnownRole = role ? known.includes(role) : false;

    const { error } = await supabase.from('creator_survey_responses').insert({
      ...rest,
      role: isKnownRole ? role : role ? 'Other' : null,
      role_other: role && !isKnownRole ? role : null,
      user_id: user?.id ?? null,
    });
    setSubmitting(false);

    if (error) {
      toast({ title: 'Could not send', description: error.message, variant: 'destructive' });
      return;
    }
    setDone(true);
  };

  const next = (skip = false) => {
    const updated = skip ? { ...answers, [question.field]: undefined } : answers;
    if (index === QUESTIONS.length - 1) {
      submit(updated);
    } else {
      setAnswers(updated);
      setIndex(index + 1);
    }
  };

  if (done) {
    return (
      <div className="rounded-lg border bg-card p-8 text-center">
        <Check className="h-8 w-8 text-primary mx-auto mb-3" />
        <h3 className="text-2xl font-bold mb-2">Thanks</h3>
        <p className="text-muted-foreground">We got it. No third-party form.</p>
      </div>
    );
  }

  if (!started) {
    return (
      <div className="rounded-lg border bg-card p-6 md:p-8">
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <MessageSquare className="h-6 w-6 text-primary mx-auto" />
          <h3 className="text-2xl md:text-3xl font-bold">Help Shape Garflock's Future</h3>
          <p className="text-muted-foreground text-lg">
            {QUESTIONS.length} questions about how you actually collaborate, get discovered, and get paid.
            Every question is skippable — answer what you feel like.
          </p>
          <div className="flex flex-wrap justify-center gap-2 pt-1">
            <Badge variant="outline">~4 minutes</Badge>
            <Badge variant="outline">All optional</Badge>
            <Badge variant="outline">No account needed</Badge>
          </div>
          <Button size="lg" onClick={() => setStarted(true)}>
            Start questionnaire
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border bg-card p-6 md:p-8">
      <Card className="max-w-2xl mx-auto border-2 border-primary/20">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
            <span>
              Question {index + 1} of {QUESTIONS.length}
            </span>
            <span>{answeredCount} answered</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2 mb-4">
            <div className="bg-primary h-2 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
          </div>
          <CardTitle className="text-lg leading-snug">{question.label}</CardTitle>
          {question.hint ? <CardDescription>{question.hint}</CardDescription> : null}
        </CardHeader>
        <CardContent className="space-y-4">
          {question.kind === 'options' ? (
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                {question.options?.map((opt) => (
                  <Button
                    key={opt}
                    type="button"
                    variant={answers[question.field] === opt ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setAnswer(opt)}
                  >
                    {opt}
                  </Button>
                ))}
              </div>
              {question.placeholder ? (
                <Input
                  placeholder={question.placeholder}
                  value={
                    question.options?.includes(answers[question.field] ?? '') ? '' : answers[question.field] ?? ''
                  }
                  onChange={(e) => setAnswer(e.target.value)}
                />
              ) : null}
            </div>
          ) : question.kind === 'short' ? (
            <Input
              placeholder={question.placeholder}
              value={answers[question.field] ?? ''}
              onChange={(e) => setAnswer(e.target.value)}
            />
          ) : (
            <Textarea
              rows={4}
              placeholder="Your answer…"
              value={answers[question.field] ?? ''}
              onChange={(e) => setAnswer(e.target.value)}
            />
          )}

          <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
            <Button variant="ghost" size="sm" disabled={index === 0} onClick={() => setIndex(index - 1)}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled={submitting} onClick={() => next(true)}>
                <SkipForward className="mr-2 h-4 w-4" />
                Skip
              </Button>
              <Button size="sm" disabled={submitting} onClick={() => next(false)}>
                {index === QUESTIONS.length - 1 ? (submitting ? 'Sending…' : 'Submit') : 'Next'}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>

          <button
            type="button"
            className="text-xs text-muted-foreground underline underline-offset-4 hover:text-foreground"
            onClick={() => submit(answers)}
            disabled={submitting}
          >
            Finish early and send what I have
          </button>
        </CardContent>
      </Card>
    </div>
  );
};

export default FeedbackQuestionnaire;
