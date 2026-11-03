export default function Loading() {
  return <div className="container-main py-12"><div className="skeleton mb-5 h-10 w-64 rounded-xl"/><div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">{Array.from({length:8},(_,i)=><div key={i} className="skeleton h-64 rounded-3xl"/>)}</div></div>;
}
