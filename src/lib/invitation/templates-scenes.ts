import { sceneInfo } from "./scenes";
import type { TemplateDef } from "./templates";
import type { ContactItem, EventItem, InvitationData, SceneId, ThemeConfig } from "./types";

/* Designs built around a live 3D scene: one for each sport and profession. */

type Plan = [time: string, title: string, note?: string][];

const plan = (items: Plan): EventItem[] => items.map(([time, title, note], i) => ({ id: `e${i + 1}`, title, time, note }));
const contact = (name: string, role: string): ContactItem[] => [{ id: "c1", name, role, phone: "+94 77 123 4567" }];

interface Spec {
  id: string;
  scene: SceneId;
  name: string;
  meaning: string;
  description: string;
  alsoFor: TemplateDef["alsoFor"];
  tags: string[];
  palette?: string;
  font: ThemeConfig["fontPair"];
  hero: "stage" | "spec" | "diorama";
  music: ThemeConfig["music"];
  effect?: ThemeConfig["effect"];
  sample: Partial<InvitationData> & { plan: Plan };
}

function make(s: Spec): TemplateDef {
  const { plan: items, ...sample } = s.sample;
  const events = plan(items);
  const group = sceneInfo[s.scene].group;
  return {
    id: s.id,
    name: s.name,
    meaning: s.meaning,
    description: s.description,
    occasion: group === "Sports" ? "sports" : "career",
    alsoFor: s.alsoFor,
    tags: ["3D", group === "Sports" ? "Sports" : "Profession", ...s.tags],
    theme: {
      paletteId: s.palette ?? s.id,
      fontPair: s.font,
      ornament: s.scene,
      hero: s.hero,
      ritual: "play",
      music: s.music,
      effect: s.effect ?? "none",
      scene: s.scene,
    },
    sample: { name2: "", ritualHint: sceneInfo[s.scene].verb, events, time: events[0].time, ...sample },
  };
}

export const sceneTemplates: TemplateDef[] = [
  /* ------------------------------ Sports ------------------------------ */
  make({
    id: "gambit", scene: "chess", name: "Gambit", meaning: "Chess",
    description: "An ivory queen crosses the board and the black king falls. Walnut, brass and Roman capitals, for tournaments and club nights.",
    alsoFor: ["birthday", "celebration", "corporate"], tags: ["Dark", "Classic"],
    font: "regal", hero: "diorama", music: "serene",
    sample: {
      name1: "Open Board", kicker: "The Colombo Chess Club invites you to", subline: "Seven round rapid tournament, all ratings welcome",
      message: "Bring your sharpest openings. We play seven rounds of rapid chess, with boards for beginners, a simultaneous display and prizes for every age group.",
      hostsLine: "Hosted by the Colombo Chess Club", venueName: "Royal MAS Arena", venueAddress: "Rajakeeya Mawatha, Colombo 07", mapQuery: "Royal MAS Arena Colombo",
      hashtag: "#OpenBoard", dressCode: "Smart casual", notes: "Boards and clocks are provided. Please arrive fifteen minutes before round one.",
      contacts: contact("Nadeesha", "Tournament director"),
      plan: [["08:30", "Check in"], ["09:00", "Round one"], ["12:30", "Lunch and simultaneous display"], ["17:00", "Final round and prizes"]],
    },
  }),
  make({
    id: "yorker", scene: "cricket", name: "Yorker", meaning: "Cricket",
    description: "Guests bowl the first ball and the stumps go flying. Outfield green, cherry red and tall poster type, for big matches and club dinners.",
    alsoFor: ["birthday", "celebration", "corporate"], tags: ["Bold", "Outdoor"],
    font: "athletic", hero: "diorama", music: "joyful",
    sample: {
      name1: "The Big Match", kicker: "Old boys, families and friends are invited to", subline: "The annual limited overs encounter",
      message: "Pads on, flags out and papare band at full volume. Join us in the pavilion for a day of cricket, lunch and old stories told louder every year.",
      hostsLine: "Hosted by the Old Boys' Union", venueName: "SSC Grounds", venueAddress: "Maitland Place, Colombo 07", mapQuery: "Sinhalese Sports Club Colombo",
      hashtag: "#TheBigMatch", dressCode: "School colours", notes: "Bring a hat and sunscreen. Pavilion seating is reserved for invited guests.",
      contacts: contact("Ravindu", "Match secretary"),
      plan: [["09:00", "Gates open"], ["09:45", "Toss and first ball"], ["13:00", "Lunch interval"], ["17:30", "Presentation"]],
    },
  }),
  make({
    id: "baseline", scene: "tennis", name: "Baseline", meaning: "Tennis",
    description: "A toss, a swing and the ball flies straight at the guest. Hard court blue against optic yellow.",
    alsoFor: ["birthday", "celebration", "corporate"], tags: ["Bold", "Bright"],
    font: "athletic", hero: "stage", music: "joyful",
    sample: {
      name1: "Centre Court", kicker: "You are invited to", subline: "Club doubles championship and garden lunch",
      message: "Two courts, sixteen pairs and a long lunch on the lawn. Come to play, come to cheer, or come for the strawberries.",
      hostsLine: "Hosted by the Lawn Tennis Club", venueName: "Green Path Courts", venueAddress: "Ananda Coomaraswamy Mawatha, Colombo 07", mapQuery: "Sri Lanka Tennis Association Colombo",
      hashtag: "#CentreCourt", dressCode: "Tennis whites", notes: "Rackets can be borrowed at the desk. Non marking shoes only.",
      contacts: contact("Ishara", "Club captain"),
      plan: [["08:00", "Warm up"], ["09:00", "Group matches"], ["12:30", "Garden lunch"], ["15:30", "Final"]],
    },
  }),
  make({
    id: "top-corner", scene: "football", name: "Top Corner", meaning: "Football",
    description: "The shot bends round the wall and ripples the net. Terrace red with heavy condensed type.",
    alsoFor: ["birthday", "celebration", "corporate"], tags: ["Bold", "Party"],
    font: "poster", hero: "stage", music: "joyful", effect: "confetti",
    sample: {
      name1: "Cup Final", kicker: "Boots on. You are invited to the", subline: "Five a side finals night under the lights",
      message: "Eight teams, one trophy and a grill that never cools down. Bring your loudest voice and your oldest shirt.",
      hostsLine: "Hosted by the Sunday League", venueName: "Race Course Ground", venueAddress: "Philip Gunawardena Mawatha, Colombo 07", mapQuery: "Colombo Race Course Ground",
      hashtag: "#CupFinal", dressCode: "Your team shirt", notes: "Artificial turf, so no metal studs. Changing rooms are open all evening.",
      contacts: contact("Malith", "League organiser"),
      plan: [["17:00", "Kick off, quarter finals"], ["18:30", "Semi finals"], ["19:30", "The final"], ["20:30", "Trophy and food"]],
    },
  }),
  make({
    id: "buzzer", scene: "basketball", name: "Buzzer", meaning: "Basketball",
    description: "The ball arcs, drops and the net snaps. Night court purple and leather orange.",
    alsoFor: ["birthday", "celebration", "corporate"], tags: ["Dark", "Evening"],
    font: "wide", hero: "stage", music: "joyful",
    sample: {
      name1: "Tip Off", kicker: "Game night. You are invited to", subline: "Three on three charity tournament",
      message: "Sixteen teams, ten minute games and a dunk contest at half time. Every basket raises money for school courts.",
      hostsLine: "Hosted by the City Hoops Collective", venueName: "Sugathadasa Indoor Stadium", venueAddress: "Arthur de Silva Mawatha, Colombo 14", mapQuery: "Sugathadasa Indoor Stadium Colombo",
      hashtag: "#TipOff", dressCode: "Jerseys and trainers", notes: "Indoor shoes only on court. Free water at every bench.",
      contacts: contact("Arjun", "Event lead"),
      plan: [["16:00", "Team check in"], ["16:30", "Tip off"], ["18:30", "Dunk contest"], ["19:30", "Final"]],
    },
  }),
  make({
    id: "drop-shot", scene: "badminton", name: "Drop Shot", meaning: "Badminton",
    description: "A feathered shuttle hangs in the air, then comes down hard. Fresh court mint with clean modern type.",
    alsoFor: ["birthday", "celebration", "corporate"], tags: ["Light", "Modern"],
    font: "wide", hero: "spec", music: "warm",
    sample: {
      name1: "Smash Night", kicker: "Company league finals", subline: "Mixed doubles, singles and a very serious dinner",
      message: "The season comes down to one evening. Join us courtside for the finals, then stay for dinner and the awards nobody admits to wanting.",
      hostsLine: "Hosted by the Mercantile Badminton League", venueName: "Keerthisinghe Hall", venueAddress: "Reid Avenue, Colombo 07", mapQuery: "Colombo badminton indoor hall",
      hashtag: "#SmashNight", dressCode: "Sportswear, then smart casual", notes: "Courtside seats are first come, first served.",
      contacts: contact("Tharushi", "League secretary"),
      plan: [["17:30", "Semi finals"], ["19:00", "Finals"], ["20:15", "Dinner and awards"]],
    },
  }),
  make({
    id: "conversion", scene: "rugby", name: "Conversion", meaning: "Rugby",
    description: "One kick, end over end, between the posts. Deep navy with amber and club house serif.",
    alsoFor: ["birthday", "celebration", "corporate"], tags: ["Dark", "Classic"],
    font: "press", hero: "diorama", music: "warm",
    sample: {
      name1: "Sevens Weekend", kicker: "The club warmly invites you to", subline: "Two days of sevens in the hill country",
      message: "Sixteen clubs, two pitches and the best view of any ground on the island. Family passes include both days and Saturday's dinner.",
      hostsLine: "Hosted by the Kandy Rugby Fellowship", venueName: "Nittawela Stadium", venueAddress: "Nittawela, Kandy", mapQuery: "Nittawela Rugby Stadium Kandy",
      hashtag: "#SevensWeekend", dressCode: "Club colours", notes: "Evenings are cool in Kandy. Bring a jacket.",
      contacts: contact("Kavindu", "Club manager"),
      plan: [["09:00", "Pool matches"], ["13:00", "Lunch on the bank"], ["15:00", "Knockouts"], ["18:30", "Dinner"]],
    },
  }),
  make({
    id: "fairway", scene: "golf", name: "Fairway", meaning: "Golf",
    description: "A small green with a waving flag, and a putt for every guest to sink. Soft morning greens and an easy serif.",
    alsoFor: ["corporate", "birthday", "celebration"], tags: ["Light", "Outdoor"],
    font: "modern", hero: "diorama", music: "serene",
    sample: {
      name1: "Captain's Day", kicker: "You are invited to", subline: "Eighteen holes, shotgun start, lunch at the clubhouse",
      message: "A friendly round in fours with a prize on every par three. Beginners join the putting league on the practice green.",
      hostsLine: "Hosted by the club captain", venueName: "Royal Colombo Golf Club", venueAddress: "223 Model Farm Road, Colombo 08", mapQuery: "Royal Colombo Golf Club",
      hashtag: "#CaptainsDay", dressCode: "Golf attire, soft spikes", notes: "Please send your handicap with your reply. Caddies are arranged.",
      contacts: contact("Dinuka", "Club office"),
      plan: [["06:00", "Breakfast"], ["06:45", "Shotgun start"], ["12:00", "Lunch and prizes"]],
    },
  }),
  make({
    id: "rally", scene: "tabletennis", name: "Rally", meaning: "Table tennis",
    description: "The ball taps between two bats and then comes right at you. Warm blush, red rubber and rounded type.",
    alsoFor: ["birthday", "celebration", "corporate"], tags: ["Playful", "Light"],
    font: "playful", hero: "spec", music: "joyful",
    sample: {
      name1: "Ping Pong Social", kicker: "Bring a partner", subline: "Open tables, house rules and a winner stays on ladder",
      message: "Six tables, music and snacks. Play one game or play all night. The ladder closes when the last table gives up.",
      hostsLine: "Hosted by the Social Club", venueName: "The Warehouse", venueAddress: "Park Street, Colombo 02", mapQuery: "Park Street Colombo",
      hashtag: "#PingPongSocial", dressCode: "Comfortable shoes", notes: "Bats are provided. Children welcome until eight.",
      contacts: contact("Sahan", "Host"),
      plan: [["18:00", "Tables open"], ["19:30", "Ladder begins"], ["21:30", "Last ball"]],
    },
  }),
  make({
    id: "podium", scene: "trophy", name: "Podium", meaning: "Awards and finals",
    description: "A gold cup turns on its plinth and lifts in a burst of confetti. For prize givings, award nights and any sport at all.",
    alsoFor: ["corporate", "graduation", "celebration"], tags: ["Dark", "Gala"],
    font: "couture", hero: "stage", music: "warm", effect: "sparkles",
    sample: {
      name1: "Sports Awards", kicker: "An evening for the champions", subline: "Annual prize giving and colours night",
      message: "Join us as we celebrate the season's winners, the record breakers and the people who turned up to every practice in the rain.",
      hostsLine: "Hosted by the Sports Council", venueName: "Cinnamon Grand, Oak Room", venueAddress: "77 Galle Road, Colombo 03", mapQuery: "Cinnamon Grand Colombo",
      hashtag: "#SportsAwards", dressCode: "Black tie or team blazer", notes: "Award winners, please be seated by seven.",
      contacts: contact("Hiruni", "Sports secretary"),
      plan: [["18:30", "Welcome drinks"], ["19:15", "Prize giving"], ["20:30", "Dinner"]],
    },
  }),

  /* ---------------------------- Professions --------------------------- */
  make({
    id: "heartbeat", scene: "doctor", name: "Heartbeat", meaning: "Doctors and nurses",
    description: "A glossy heart beats inside the loop of a stethoscope. Calm clinical teal for new practices, white coats and retirements.",
    alsoFor: ["graduation", "celebration", "corporate"], tags: ["Light", "Calm"],
    font: "modern", hero: "spec", music: "serene",
    sample: {
      name1: "Dr Maya Perera", kicker: "The doctor will see you now", subline: "Opening of the Lakeside Family Practice",
      message: "After twelve years on the wards, a practice of our own. Please join us for the opening, a look around and afternoon tea.",
      hostsLine: "With the team at Lakeside", venueName: "Lakeside Family Practice", venueAddress: "Nawala Road, Rajagiriya", mapQuery: "Rajagiriya Colombo",
      hashtag: "#LakesidePractice", dressCode: "Smart casual", notes: "Parking is behind the building.",
      contacts: contact("Nadeesha", "Practice manager"),
      plan: [["15:30", "Doors open"], ["16:00", "Ribbon cutting"], ["16:30", "Tea and tours"]],
    },
  }),
  make({
    id: "verdict", scene: "lawyer", name: "Verdict", meaning: "Law",
    description: "The gavel falls twice and court is in session. Oxblood, polished walnut and brass, for calls to the bar and new chambers.",
    alsoFor: ["graduation", "celebration", "corporate"], tags: ["Dark", "Formal"],
    font: "regal", hero: "stage", music: "warm",
    sample: {
      name1: "Arjun Silva", kicker: "All rise to celebrate", subline: "Called to the bar, attorney at law",
      message: "The exams are passed, the oath is taken and the argument is won. Please join our family for dinner to mark the occasion.",
      hostsLine: "Hosted by the Silva family", venueName: "The Hulftsdorp Rooms", venueAddress: "Hulftsdorp Street, Colombo 12", mapQuery: "Hulftsdorp Colombo",
      hashtag: "#CalledToTheBar", dressCode: "Formal", notes: "Objections will be heard at the bar, not at the table.",
      contacts: contact("Shalini", "Family"),
      plan: [["18:30", "Drinks"], ["19:15", "Toasts"], ["20:00", "Dinner"]],
    },
  }),
  make({
    id: "blueprint", scene: "architect", name: "Blueprint", meaning: "Architects and builders",
    description: "Floor, wall and roof drop into place and lift apart again as you scroll. For studio openings, handovers and housewarmings.",
    alsoFor: ["housewarming", "corporate", "celebration"], tags: ["Light", "Modern"],
    font: "editorial", hero: "spec", music: "serene",
    sample: {
      name1: "Studio Nine", kicker: "Open house", subline: "Ten years of drawing, one evening of showing",
      message: "Walk through the models, meet the people who built them and see what is on the boards for next year.",
      hostsLine: "Hosted by the partners", venueName: "Studio Nine", venueAddress: "Barnes Place, Colombo 07", mapQuery: "Barnes Place Colombo",
      hashtag: "#StudioNine", dressCode: "Come as you are", notes: "The entrance is through the courtyard.",
      contacts: contact("Ishara", "Studio"),
      plan: [["17:30", "Doors open"], ["18:30", "Walk through"], ["19:30", "Drinks on the roof"]],
    },
  }),
  make({
    id: "mise", scene: "chef", name: "Mise", meaning: "Chefs and restaurants",
    description: "The silver cloche lifts on the first course. Saffron and deep red, for openings, supper clubs and chef's tables.",
    alsoFor: ["birthday", "celebration", "anniversary"], tags: ["Bold", "Food"],
    font: "couture", hero: "stage", music: "warm",
    sample: {
      name1: "First Table", kicker: "Chef Tara Mendis invites you to the", subline: "Opening night, seven courses",
      message: "Before the doors open to everyone, they open to you. One long table, seven courses and the first pour of the cellar.",
      hostsLine: "From the kitchen team", venueName: "Saffron House", venueAddress: "Horton Place, Colombo 07", mapQuery: "Horton Place Colombo",
      hashtag: "#FirstTable", dressCode: "Dress for dinner", notes: "Tell us about allergies in your reply.",
      contacts: contact("Nuwan", "Front of house"),
      plan: [["19:00", "Welcome drink"], ["19:30", "First course"], ["22:00", "Coffee and the kitchen tour"]],
    },
  }),
  make({
    id: "commit", scene: "developer", name: "Commit", meaning: "Software and start ups",
    description: "The laptop opens, the screen lights and code appears. Graphite and amber in a typewriter face, for launches and hack nights.",
    alsoFor: ["corporate", "graduation", "celebration"], tags: ["Dark", "Tech"],
    font: "terminal", hero: "spec", music: "none",
    sample: {
      name1: "Launch Night", kicker: "Version 1.0", subline: "We are shipping. Come and watch it go live",
      message: "Two years, four rewrites and one very patient team. Join us as we press the button, then stay for demos and dinner.",
      hostsLine: "From everyone on the team", venueName: "Hatch Works", venueAddress: "Prince Street, Colombo 01", mapQuery: "Hatch Works Colombo",
      hashtag: "#LaunchNight", dressCode: "Hoodies welcome", notes: "There is wifi. Please do not push to main.",
      contacts: contact("Sahan", "Engineering"),
      plan: [["18:00", "Doors open"], ["19:00", "Launch"], ["19:30", "Demos and dinner"]],
    },
  }),
  make({
    id: "cleared", scene: "pilot", name: "Cleared", meaning: "Pilots and cabin crew",
    description: "An aeroplane banks over the clouds, then climbs away. Open sky blue, for wings ceremonies, last flights and send offs.",
    alsoFor: ["graduation", "celebration", "save-the-date"], tags: ["Light", "Travel"],
    font: "wide", hero: "stage", music: "serene",
    sample: {
      name1: "First Wings", kicker: "Cleared for take off", subline: "Captain Nuwan Dias, wings ceremony",
      message: "Fifteen hundred hours, three type ratings and one very proud family. Join us on the apron for the ceremony and lunch in the hangar.",
      hostsLine: "Hosted by the Dias family", venueName: "Ratmalana Airport, Hangar 2", venueAddress: "Airport Road, Ratmalana", mapQuery: "Ratmalana Airport",
      hashtag: "#FirstWings", dressCode: "Smart casual, flat shoes", notes: "Please bring photo identification for the gate.",
      contacts: contact("Amaya", "Family"),
      plan: [["10:00", "Boarding"], ["10:45", "Wings ceremony"], ["12:30", "Hangar lunch"]],
    },
  }),
  make({
    id: "aperture", scene: "photographer", name: "Aperture", meaning: "Photographers and artists",
    description: "The blades close, the flash fires and the card opens. Gallery grey with one red dot.",
    alsoFor: ["celebration", "corporate", "anniversary"], tags: ["Light", "Minimal"],
    font: "editorial", hero: "spec", music: "none",
    sample: {
      name1: "Still Here", kicker: "Private view", subline: "Photographs by Elena Fonseka, 2016 to 2026",
      message: "Forty prints from ten years on the road. Join us for the first evening, before the walls are open to the public.",
      hostsLine: "Presented by Gallery Nineteen", venueName: "Gallery Nineteen", venueAddress: "Guildford Crescent, Colombo 07", mapQuery: "Guildford Crescent Colombo",
      hashtag: "#StillHere", dressCode: "Gallery black", notes: "The show runs for three weeks after the opening.",
      contacts: contact("Marco", "Gallery"),
      plan: [["18:00", "Private view"], ["19:00", "In conversation"], ["20:30", "Close"]],
    },
  }),
  make({
    id: "chalk", scene: "teacher", name: "Chalk", meaning: "Teachers and schools",
    description: "Four books drop into a stack and an apple lands on top. Blackboard green, for retirements, prize days and reunions.",
    alsoFor: ["graduation", "celebration", "birthday"], tags: ["Dark", "Warm"],
    font: "handwritten", hero: "diorama", music: "warm",
    sample: {
      name1: "Mrs Jayasuriya", kicker: "Class dismissed", subline: "A farewell tea after thirty four years of teaching",
      message: "If you ever sat in the third row, forgot your homework or learned to love a poem, this one is for you. Bring a story and stay for tea.",
      hostsLine: "From past pupils and staff", venueName: "The School Hall", venueAddress: "Flower Road, Colombo 07", mapQuery: "Flower Road Colombo",
      hashtag: "#ClassDismissed", dressCode: "School colours, if they still fit", notes: "Please send old photographs with your reply.",
      contacts: contact("Priya", "Past pupils"),
      plan: [["15:30", "Roll call"], ["16:00", "Stories and songs"], ["17:00", "Tea"]],
    },
  }),
  make({
    id: "b-side", scene: "musician", name: "B Side", meaning: "Musicians and DJs",
    description: "A record lands on the platter, the arm swings across and the rings of sound begin. Plum, pink and gold.",
    alsoFor: ["birthday", "celebration", "anniversary"], tags: ["Dark", "Party"],
    font: "poster", hero: "diorama", music: "joyful",
    sample: {
      name1: "Listening Party", kicker: "Drop the needle with us", subline: "Album launch, both sides, very loud",
      message: "Hear the record from first track to last on a proper system, with the people who made it. Vinyl, drinks and dancing after side two.",
      hostsLine: "Hosted by Night Garden Records", venueName: "The Listening Room", venueAddress: "Alfred House Gardens, Colombo 03", mapQuery: "Alfred House Gardens Colombo",
      hashtag: "#ListeningParty", dressCode: "Something that shines", notes: "Phones away for side one, please.",
      contacts: contact("Tara", "Label"),
      plan: [["19:00", "Doors"], ["20:00", "Side one"], ["20:45", "Side two"], ["21:30", "Dancing"]],
    },
  }),
  make({
    id: "torque", scene: "engineer", name: "Torque", meaning: "Engineers and makers",
    description: "Steel and brass gears slide together and start to turn. Safety orange with heavy type, for openings and milestones.",
    alsoFor: ["corporate", "graduation", "celebration"], tags: ["Bold", "Industrial"],
    font: "athletic", hero: "stage", music: "none",
    sample: {
      name1: "Plant Opening", kicker: "Everything is in gear", subline: "Commissioning of the Horana works",
      message: "Three years from first drawing to first part. Walk the line, meet the crew and be there when we start it up.",
      hostsLine: "Hosted by the engineering team", venueName: "Horana Works", venueAddress: "Export Processing Zone, Horana", mapQuery: "Horana Export Processing Zone",
      hashtag: "#InGear", dressCode: "Closed shoes. We supply the helmets", notes: "Coaches leave Colombo at eight.",
      contacts: contact("Ruwan", "Site office"),
      plan: [["10:00", "Arrival and safety briefing"], ["10:30", "Start up"], ["11:00", "Plant tour"], ["12:30", "Lunch"]],
    },
  }),
];
