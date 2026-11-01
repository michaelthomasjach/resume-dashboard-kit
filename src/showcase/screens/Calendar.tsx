import { useState } from "react";
import { Button, MonthCalendar, PlusIcon, type CalendarEvent } from "@michaelthomasjach/liseuse-dashboard-kit";
import { ScreenHead } from "../Specimen";
import { CALENDAR_EVENTS, CALENDAR_TODAY } from "../appData";

/**
 * Le calendrier de l'équipe. « Aujourd'hui » est fixé (`CALENDAR_TODAY`) pour que l'écran ne
 * change pas d'un jour à l'autre. Créer un événement — double-clic sur un jour, « + » au survol, ou
 * le bouton de la barre — en ajoute un, sans titre propre, au jour choisi : assez pour voir la
 * grille réagir, sans formulaire à monter. Un clic sur un événement ouvre sa fiche (une modale du
 * kit) ; on peut l'y supprimer.
 */
export function Calendar() {
  const [events, setEvents] = useState<CalendarEvent[]>(CALENDAR_EVENTS);
  const [selected, setSelected] = useState<string | Date>(CALENDAR_TODAY);

  const create = (date: Date) => {
    const day = date.toLocaleDateString("sv-SE");
    setEvents((all) => [...all, { id: `n${all.length + 1}`, title: "Nouvel événement", start: day, tone: "accent" }]);
  };

  return (
    <div className="rdk-screen rdk-screen--full">
      <ScreenHead title="Calendrier" intro="Les réunions, congés et échéances de l'équipe, au mois ou à la semaine." />
      <MonthCalendar
        events={events}
        today={CALENDAR_TODAY}
        selectedDate={selected}
        onSelectedDateChange={setSelected}
        onCreate={create}
        onEventDelete={(ev) => setEvents((all) => all.filter((e) => e.id !== ev.id))}
        actions={
          <Button tone="primary" icon={<PlusIcon size={16} />} onClick={() => create(selected instanceof Date ? selected : new Date(`${selected}T12:00`))}>
            Nouvel événement
          </Button>
        }
      />
    </div>
  );
}
