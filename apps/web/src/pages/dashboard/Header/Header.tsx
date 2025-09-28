import { Button } from "@repo/ui";

type HeaderProps = {
  title: string;
  subtitle: string;
};

export default function Header(props: HeaderProps) {
  const { title, subtitle } = props;

  return (
    <div className="flex items-center justify-between gap-2 mb-6">
      <div className="flex items-center gap-3">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/7/75/Emblem_of_the_First_Galactic_Empire.svg"
          width="80px"
          alt="Empire Emblem"
        />
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
          {subtitle ? (
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          ) : null}
        </div>
      </div>
      <Button variant="outline" className="gap-2">
        Déconnexion
      </Button>
    </div>
  );
}
