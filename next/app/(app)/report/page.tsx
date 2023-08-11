import Link from 'next/link'

export default function Report() {
    return (
        <>
            <div className="text-lg mb-4 text-stone-700 text-center sticky overflow-hidden">
                <div className="text-2xl">
                    This feature will be coming soon!
                </div>
             For now email
                <Link href='mailto:gavin@gav.ink'
                > gavin@gav.ink </Link>
            with a screenshot of the issue
            </div>
        </>
    )
}