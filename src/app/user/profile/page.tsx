export default function page() {
    return (
        <div className={`flex flex-col bg-slate-900 border border-slate-500 rounded-md w-full h-1/2`} >
            <div>
                {params.id}
            </div>
        </div>
    )
}