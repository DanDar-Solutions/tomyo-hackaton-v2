import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

interface Question {
    id: string
    question_order: number
    question_text: string
    category: string
    options: string[] | { label: string; value: string }[]
}

interface QuestionsProps {
    user: any
    onComplete: (updatedUser: any) => void
}

const stressMap: Record<string, string> = { very_low: 'high', low: 'medium', medium: 'low', high: 'very_low' }
const riskMap: Record<string, string> = { very_easy: 'low', easy: 'low', medium: 'medium', hard: 'high' }

const normalizeOptions = (options: any): { label: string; value: string }[] =>
    Array.isArray(options)
        ? options.map((o) => (typeof o === 'string' ? { label: o, value: o } : o))
        : []

const isTime = (cat: string) => cat.toLowerCase().includes('time') || cat.toLowerCase() === 'schedule'
const isNumber = (cat: string) => cat === 'grade'

export default function Questions({ user, onComplete }: QuestionsProps) {
    const [questions, setQuestions] = useState<Question[]>([])
    const [current, setCurrent] = useState(0)
    const [answers, setAnswers] = useState<Record<string, any>>({})
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [animating, setAnimating] = useState(false)
    const [direction, setDirection] = useState<'forward' | 'back'>('forward')
    const supabase = createClient()
    useEffect(() => {
        supabase
            .from('questions')
            .select('*')
            .order('question_order', { ascending: true })
            .then(({ data, error }) => {
                if (error) setError('Failed to load questions.')
                else setQuestions(data || [])
                setLoading(false)
            })
    }, [])

    const goTo = (next: number, dir: 'forward' | 'back') => {
        setDirection(dir)
        setAnimating(true)
        setTimeout(() => { setCurrent(next); setAnimating(false) }, 280)
    }

    const handleSelect = (value: string) =>
        setAnswers((prev) => ({ ...prev, [questions[current].id]: value }))

    const handleNext = () =>
        current < questions.length - 1 ? goTo(current + 1, 'forward') : handleSubmit()

    const handleSubmit = async () => {
        setSaving(true)
        setError(null)

        const payload: Record<string, any> = { user_id: user.user_id }

        questions.forEach((q) => {
            const value = answers[q.id]
            if (value === undefined) return
            switch (q.category) {
                case 'learning_style': payload.learning_style = value; break
                case 'energy_level': payload.stress_level = stressMap[value] ?? value; break
                case 'homework_difficulty': payload.procrastination_risk = riskMap[value] ?? value; break
                case 'reminder_tone': payload.reminder_tone = value; break
                case 'schedule': {
                    const t = value.length === 5 ? `${value}:00` : value
                    const text = q.question_text.toLowerCase()
                    if (text.includes('home') || text.includes('arrive') || text.includes('гэртээ')) payload.home_arrival_time = t
                    else if (text.includes('study') || text.includes('start') || text.includes('суралц')) payload.study_start_time = t
                    else if (text.includes('sleep') || text.includes('bed') || text.includes('унт')) payload.sleep_time = t
                    break
                }
            }
        })

        const { error: err } = await supabase.from('user_profiles').upsert(payload, { onConflict: 'user_id' })
        if (err) { setError('Failed to save your profile. Please try again.'); setSaving(false) }
        else onComplete(user)
    }

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-[#f5f0e8] font-['Sora',sans-serif] p-6 relative overflow-hidden">
            <div className="flex flex-col items-center gap-4 text-[#7a6e5f] text-[0.9rem]">
                <div className="w-9 h-9 border-[3px] border-black/10 border-t-[#7ea86a] rounded-full animate-spin" />
                <p>Loading your setup…</p>
            </div>
        </div>
    )

    if (!questions.length) return (
        <div className="min-h-screen flex items-center justify-center bg-[#f5f0e8] font-['Sora',sans-serif] p-6 relative overflow-hidden">
            <div className="bg-[#fffdf7] rounded-3xl border border-black/[0.07] shadow-[0_2px_4px_rgba(0,0,0,0.04),0_8px_32px_rgba(0,0,0,0.06)] p-10 pb-9 flex flex-col">
                <p className="text-[#2c2416] font-medium">No questions found. Please contact support.</p>
            </div>
        </div>
    )

    const q = questions[current]
    const opts = normalizeOptions(q.options)
    const currentAnswer = answers[q.id] ?? ''
    const progress = ((current + 1) / questions.length) * 100
    const isLast = current === questions.length - 1
    const canProceed = currentAnswer !== ''

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#f5f0e8] font-['Sora',sans-serif] p-6 relative overflow-hidden">
            {/* Background blobs */}
            <div className="absolute rounded-full blur-[80px] opacity-35 pointer-events-none w-[480px] h-[480px] bg-[radial-gradient(circle,#c9d8b6_0%,#a8c090_100%)] -top-[120px] -right-[100px]" />
            <div className="absolute rounded-full blur-[80px] opacity-35 pointer-events-none w-[360px] h-[360px] bg-[radial-gradient(circle,#e8d5b0_0%,#d4b896_100%)] -bottom-[80px] -left-[80px]" />

            <div className="w-full max-w-[540px] relative z-[1] flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between mb-[18px]">
                    <span className="font-['Lora',serif] italic text-[1.1rem] text-[#4a4235] -tracking-[0.01em]">Student Portal</span>
                    <span className="text-[0.75rem] font-semibold tracking-[0.06em] uppercase text-[#7a6e5f] bg-white/60 border border-black/[0.08] px-2.5 py-1 rounded-[20px]">{current + 1} / {questions.length}</span>
                </div>

                {/* Progress bar */}
                <div className="h-1 bg-black/[0.08] rounded overflow-hidden mb-7">
                    <div className="h-full bg-gradient-to-r from-[#7ea86a] to-[#5c8c48] rounded transition-[width] duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]" style={{ width: `${progress}%` }} />
                </div>

                {/* Card */}
                <div className={`bg-[#fffdf7] rounded-3xl border border-black/[0.07] shadow-[0_2px_4px_rgba(0,0,0,0.04),0_8px_32px_rgba(0,0,0,0.06)] p-10 pb-9 min-h-[340px] flex flex-col max-sm:px-[22px] max-sm:py-7 max-sm:pb-6 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                    animating
                        ? (direction === 'forward' ? 'opacity-0 -translate-x-5' : 'opacity-0 translate-x-5')
                        : 'opacity-100 translate-x-0 animate-[slideIn_0.3s_cubic-bezier(0.22,1,0.36,1)_forwards]'
                }`}>
                    <div className="text-[0.68rem] font-semibold tracking-[0.1em] uppercase text-[#9b8c79] mb-3.5">{q.category.replace(/_/g, ' ')}</div>
                    <h2 className="font-['Lora',serif] text-[1.55rem] max-sm:text-[1.25rem] font-semibold text-[#2c2416] leading-[1.35] m-0 mb-7 -tracking-[0.02em]">{q.question_text}</h2>

                    {/* Options grid or text input */}
                    {opts.length > 0 ? (
                        <div className={`flex flex-col gap-2.5 flex-1 ${opts.length > 4 ? 'grid grid-cols-2 max-sm:grid-cols-1' : ''}`}>
                            {opts.map((opt) => (
                                <button
                                    key={opt.value}
                                    className={`relative border-[1.5px] rounded-xl py-[13px] px-[18px] text-[0.9rem] font-medium cursor-pointer text-left transition-all duration-[180ms] ease-out font-['Sora',sans-serif] flex items-center gap-2.5
                                        ${currentAnswer === opt.value
                                            ? 'bg-[#2c2416] text-[#f5f0e8] border-[#2c2416] hover:bg-[#3a3028] hover:border-[#3a3028]'
                                            : 'bg-[#f5f0e8] text-[#3a3028] border-transparent hover:bg-[#ede7d8] hover:border-black/10 hover:-translate-y-px'}`}
                                    onClick={() => handleSelect(opt.value)}
                                >
                                    {currentAnswer === opt.value && <span className="text-[0.8rem] text-[#c9d8b6] shrink-0">✓</span>}
                                    {opt.label}
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div className="flex-1 flex items-start pt-2">
                            <input
                                type={isTime(q.category) ? 'time' : isNumber(q.category) ? 'number' : 'text'}
                                className="w-full bg-[#f0ebe0] border-[1.5px] border-black/[0.08] rounded-xl py-[14px] px-[18px] text-base font-medium text-[#2c2416] font-['Sora',sans-serif] outline-none transition-all duration-[180ms] focus:border-[#7ea86a] focus:shadow-[0_0_0_3px_rgba(126,168,106,0.15)] placeholder:text-[#b0a596] placeholder:font-normal"
                                placeholder={isNumber(q.category) ? 'Enter a number' : 'Type your answer…'}
                                value={currentAnswer}
                                onChange={(e) => handleSelect(e.target.value)}
                                {...(isNumber(q.category) ? { min: 1, max: 12 } : {})}
                            />
                        </div>
                    )}

                    {error && <p className="mt-3 text-[0.82rem] text-[#c0392b] font-medium">{error}</p>}
                </div>

                {/* Navigation */}
                <div className="flex items-center justify-between mt-5">
                    <button
                        className="bg-transparent border-none font-['Sora',sans-serif] text-[0.88rem] font-medium text-[#7a6e5f] cursor-pointer py-2.5 px-0 transition-colors duration-[180ms] hover:text-[#2c2416] disabled:opacity-30 disabled:cursor-not-allowed"
                        onClick={() => goTo(current - 1, 'back')}
                        disabled={current === 0}
                    >
                        ← Back
                    </button>
                    <button
                        className="bg-[#2c2416] text-[#f5f0e8] border-none rounded-xl py-[13px] px-7 font-['Sora',sans-serif] text-[0.9rem] font-semibold cursor-pointer transition-all duration-[180ms] ease-out min-w-[140px] flex items-center justify-center gap-2 hover:bg-[#3a3028] hover:-translate-y-px hover:shadow-[0_4px_16px_rgba(44,36,22,0.2)] disabled:opacity-35 disabled:cursor-not-allowed disabled:translate-y-0 disabled:shadow-none"
                        onClick={handleNext}
                        disabled={!canProceed || saving}
                    >
                        {saving ? <span className="w-4 h-4 border-2 border-[#f5f0e8]/30 border-t-[#f5f0e8] rounded-full animate-spin inline-block" /> : isLast ? 'Finish setup →' : 'Next →'}
                    </button>
                </div>
            </div>
        </div>
    )
}