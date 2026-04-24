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
            className="rounded-full border border-white/20 bg-white/5 px-4 py-1.5 transition hover:bg-white/10"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
