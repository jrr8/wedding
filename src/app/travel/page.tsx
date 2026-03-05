import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "Travel & Accommodations | Georgia + Riley",
};

export default function TravelPage() {
  return (
    <div className="min-h-full p-6 pb-20 sm:p-10 md:p-20 text-gray-100">
      <div className="max-w-[850px] mx-auto flex flex-col gap-12">
        <div className="flex flex-col gap-2">
          <Link
            href="/"
            className="text-sm text-foreground/70 hover:text-foreground underline underline-offset-2 w-fit visited:text-purple-300"
          >
            ← Back
          </Link>
          <h1 className="text-4xl font-swash font-bold">
            Travel & Accommodations
          </h1>
        </div>

        <section className="flex flex-col gap-4">
          <div className="bg-white/90 text-gray-900 p-6 rounded-lg">
            <div className="text-lg">
              We appreciate that getting to Upstate New York can be logistically
              complicated, and we are grateful to you for making the journey! We
              really hope to see you there, so please let us know if you need
              extra help planning your trip.
            </div>
          </div>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="text-2xl font-swash font-bold">Airports</h2>
          <div className="bg-white/90 text-gray-900 p-6 rounded-lg">
            <ul className="list-disc list-outside ml-4 space-y-3 text-lg">
              <li>
                <strong>Albany International (ALB)</strong>
                <ul className="list-[circle] list-outside space-y-1 pl-4 mt-1">
                  <li>90 minute drive to Kismet House</li>
                </ul>
              </li>
              <li>
                <strong>Newark Liberty (EWR)</strong>
                <ul className="list-[circle] list-outside space-y-1 pl-4 mt-1">
                  <li>90 minute drive to Kismet House (expect some traffic)</li>
                </ul>
              </li>
              <li>
                <strong>LaGuardia (LGA) or JFK</strong>
                <ul className="list-[circle] list-outside space-y-1 pl-4 mt-1">
                  <li>
                    Highly variable driving times due to traffic (1.5 - 3 hours)
                  </li>
                  <li>
                    Public transportation is recommended! More information below
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="text-2xl font-swash font-bold">
            Public Transportation
          </h2>
          <div className="bg-white/90 text-gray-900 p-6 rounded-lg text-lg">
            <h3 className="font-semibold mb-2">Getting to Grand Central</h3>
            <ul className="list-disc list-outside ml-4 space-y-3 mb-6">
              <li>
                MTA subway/bus
                <ul className="list-[circle] list-outside space-y-1 pl-4 mt-1">
                  <li>40 minutes from LGA or JFK, 1 hour from Newark</li>
                  <li>
                    No need to buy a subway card—all MTA stations use tap-to-pay
                  </li>
                </ul>
              </li>
              <li>
                Uber/Lyft/Taxi
                <ul className="list-[circle] list-outside space-y-1 pl-4 mt-1">
                  <li>30-60 minutes from LGA, JFK, or Newark</li>
                </ul>
              </li>
            </ul>

            <h3 className="text-lg font-semibold mb-2">
              Grand Central to Poughkeepsie{" "}
              <span className="text-2xl pl-1">🚂</span>
            </h3>
            <ul className="list-disc list-outside ml-4 space-y-3 mb-6">
              <li>
                A scenic 2 hour ride on the Metro-North Railroad through the
                Hudson Valley
              </li>
              <li>
                Ride the Hudson Line to Poughkeepsie station
                <ul className="list-[circle] list-outside space-y-1 pl-4 mt-1">
                  <li>
                    A window seat on the west side of the train (the left side
                    when facing the front) will give you the best views of the
                    Hudson River
                  </li>
                  <li>
                    You can purchase tickets in advance using the MTA&apos;s
                    TrainTime app ($21 one way)
                  </li>
                </ul>
              </li>
              <li>
                The Grand Central dining concourse downstairs offers a variety
                of restaurants and cafés before your ride
              </li>
            </ul>

            <h3 className="text-lg font-semibold mb-2">
              Poughkeepsie Station to Kismet House
            </h3>
            <ul className="list-disc list-outside ml-4 space-y-3 mb-6">
              <li>
                Uber/Lyft are available, with typical wait times of 5-15 minutes
              </li>
              <li>
                Kismet House is a 20 minute drive from the station, and so are
                many local accommodations
              </li>
            </ul>
          </div>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="text-2xl font-swash font-bold">
            Accommodations in the Area
          </h2>
          <div className="bg-white/90 text-gray-900 p-6 rounded-lg text-lg">
            There are Airbnbs, traditional bed &amp; breakfasts, and these
            nearby hotels:
            <ul className="list-disc list-outside ml-4 space-y-3 mt-3">
              <li>
                <a
                  href="https://www.rockinghorseranch.com/award-winning-accommodations/"
                  target="_blank"
                >
                  Rocking Horse Ranch Resort
                </a>{" "}
                - 8 minute drive to Kismet House
              </li>
              <li>
                <a
                  href="https://www.choicehotels.com/new-york/new-paltz/rodeway-inn-hotels/ny331"
                  target="_blank"
                >
                  Rodeway Inn & Suites New Paltz
                </a>{" "}
                - 9 minute drive to Kismet House
              </li>
              <li>
                <a
                  href="https://www.hilton.com/en/hotels/pounphx-hampton-new-paltz/"
                  target="_blank"
                >
                  Hampton Inn by Hilton New Paltz
                </a>{" "}
                - 12 minute drive to Kismet House
              </li>
              <li>
                <a
                  href="https://www.sonesta.com/americas-best-value-inn/ny/new-paltz/americas-best-value-inn-new-paltz"
                  target="_blank"
                >
                  America&apos;s Best Value Inn New Paltz
                </a>{" "}
                - 12 minute drive to Kismet House
              </li>
            </ul>
          </div>
        </section>

        <Image
          src="/wedding-weekend.jpg"
          alt="Venue Map"
          width={692}
          height={722}
          quality={50}
          className="rounded-lg shadow-lg w-full max-w-[600px] self-center"
        />
      </div>
    </div>
  );
}
