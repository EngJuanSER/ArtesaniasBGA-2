export function ZodErrors({ error }: { error: string[] }) {
    if (!error) return null;
    return error.map((err: string, index: number) => (
      <div key={index} className="text-black dark:text-pink-200 text-xs italic mt-1 py-2">
        {err}
      </div>
    ));
  }