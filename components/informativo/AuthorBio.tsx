import { User, Instagram, Linkedin, Mail } from 'lucide-react'

type AuthorBioProps = {
  fullName: string
  photoUrl: string | null
  bio: string | null
  instagram: string | null
  linkedin: string | null
  email: string | null
}

export default function AuthorBio({
  fullName,
  photoUrl,
  bio,
  instagram,
  linkedin,
  email,
}: AuthorBioProps) {
  return (
    <aside className="rounded-xl border bg-card p-6">
      <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
        <div className="size-16 shrink-0 overflow-hidden rounded-full bg-muted">
          {photoUrl ? (
            <img
              src={photoUrl}
              alt={fullName}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <User className="size-6 text-muted-foreground/60" />
            </div>
          )}
        </div>

        <div className="flex-1 text-center sm:text-left">
          <h3 className="text-lg font-semibold text-foreground">
            {fullName}
          </h3>

          {bio && (
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
              {bio}
            </p>
          )}

          <div className="mt-3 flex items-center justify-center gap-3 sm:justify-start">
            {instagram && (
              <a
                href={`https://instagram.com/${instagram}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
                title={`Instagram de ${fullName}`}
              >
                <Instagram className="size-4" />
                <span className="hidden sm:inline">@{instagram}</span>
              </a>
            )}
            {linkedin && (
              <a
                href={linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
                title={`LinkedIn de ${fullName}`}
              >
                <Linkedin className="size-4" />
              </a>
            )}
            {email && (
              <a
                href={`mailto:${email}`}
                className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
                title={`Email de ${fullName}`}
              >
                <Mail className="size-4" />
              </a>
            )}
          </div>
        </div>
      </div>
    </aside>
  )
}
