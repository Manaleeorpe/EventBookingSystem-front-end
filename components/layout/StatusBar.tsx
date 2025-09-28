
export default function StatusBar() {
  return (
    <div className="flex justify-between items-center p-4 pt-12">
      <div></div>
      <div className="flex items-center gap-1">
        <div className="flex gap-1">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-1 w-1 bg-black rounded-full"></div>
          ))}
        </div>
        <div className="ml-2 text-sm">📶 📶 🔋</div>
      </div>
    </div>
  )
}