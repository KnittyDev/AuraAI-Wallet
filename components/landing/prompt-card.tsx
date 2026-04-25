export function PromptCard() {
  return (
    <div className="mt-16 w-full max-w-4xl rounded-[32px] border border-white/15 bg-black/45 p-6 text-left shadow-2xl backdrop-blur-sm md:p-8">
      <label htmlFor="prompt" className="sr-only">
        Prompt
      </label>
      <textarea
        id="prompt"
        rows={3}
        placeholder="How do you want your portfolio to perform?"
        className="w-full resize-none bg-transparent text-xl text-white/85 outline-none placeholder:text-white/55 md:text-2xl"
      />

      <div className="mt-8 flex flex-wrap items-center justify-end gap-4 text-sm text-white/75">
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="rounded-full border border-white/20 bg-white/5 px-4 py-1.5 transition hover:bg-white/10"
          >
            Opus 4.7
          </button>
          <button
            type="button"
            className="rounded-full border border-white/20 bg-white/5 p-2.5 transition hover:bg-white/10"
            aria-label="Send prompt"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4 text-white/90"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M5 12H19M19 12L13 6M19 12L13 18"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
