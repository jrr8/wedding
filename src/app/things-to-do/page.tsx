import Link from "next/link";

export const metadata = {
  title: "Things to do | Georgia + Riley",
};

export default function ToDoPage() {
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
            Things to do
          </h1>
        </div>

        <section className="flex flex-col gap-4">
          <div className="bg-white/90 text-gray-900 p-6 rounded-lg">
            <div className="text-lg">
              There is plenty to explore in the Hudson Valley.
              Take a look at this short list for some ideas!
            </div>
          </div>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="text-2xl font-swash font-bold">Restaurants</h2>
          <div className="bg-white/90 text-gray-900 p-6 rounded-lg text-lg">
            We've visited these restaurants and enjoyed them. There are surely others in
            the area that are worth a visit too.
            <ul className="list-disc list-outside mt-2 ml-4 space-y-3">
              <li>
                <strong>
                  <a
                    href="https://www.maincoursecatering.com/marketplace.html"
                    target="_blank"
                  >
                    Main Course
                  </a></strong> 🥙
                <ul className="list-[circle] list-outside space-y-1 pl-4 mt-1">
                  <li>Casual American fare in New Paltz with local, seasonal options in a counter service setting</li>
                </ul>
              </li>
              <li>
                <strong>
                  <a
                    href="https://www.brooklynciderhouse.com/"
                    target="_blank"
                  >
                    Brooklyn Cider House
                  </a></strong> 🍎
                <ul className="list-[circle] list-outside space-y-1 pl-4 mt-1">
                  <li>Active cider orchard with cider, donuts, and pizza</li>
                  <li>They often have live music, and you can stroll through the orchards</li>
                </ul>
              </li>
              <li>
                <strong>
                  <a
                    href="https://bacchusnewpaltz.com/"
                    target="_blank"
                  >
                    Bacchus Restaurant, Brewery & Billiards
                  </a></strong> 🍻
                <ul className="list-[circle] list-outside space-y-1 pl-4 mt-1">
                  <li>Large pub in New Paltz with a great beer selection and large pool room</li>
                  <li><i>Riley's advice:</i> Keep an eye out for any beers from the Hill Farmstead brewery.
                    It's not always in stock, but regardless the bartender will be able to recommend something you like.</li>
                </ul>
              </li>
            </ul>
          </div>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="text-2xl font-swash font-bold">
            Activities
          </h2>
          <div className="bg-white/90 text-gray-900 p-6 rounded-lg text-lg">
            Enjoy the natural beauty of the area if you have any spare time.
            <ul className="list-disc list-outside mt-2 ml-4 space-y-3">
              <li>
                <strong>
                  <a
                    href="https://parks.ny.gov/visit/state-parks/minnewaska-state-park-preserve"
                    target="_blank"
                  >
                    Minnewaska State Park
                  </a></strong>
                <ul className="list-[circle] list-outside space-y-1 pl-4 mt-1">
                  <li>Only about a 30 minute drive away, this large park offers many hikes through the Shawangunk Mountain Ridge, famed for its rock climbing opportunities</li>
                  <li>The park opens at 9 AM, and there is a $10 parking fee. It may get busy on the weekends too, so better to arrive early</li>
                </ul>
              </li>
              <li>
                <strong>
                  <a
                    href="https://empiretrail.ny.gov/"
                    target="_blank"
                  >
                    Empire State Trail
                  </a></strong>
                <ul className="list-[circle] list-outside space-y-1 pl-4 mt-1">
                  <li>This 750 mile rail trail runs from Manhattan to Buffalo</li>
                  <li>There are several parking areas <a href="https://empiretrail.ny.gov/poughkeepsie-albany/lloyd-new-paltz">in the area</a>
                  {' '}you can use to access the trail
                  </li>
                  <li>Ideal for a walk or bike on a flat, mostly crushed gravel path through fields and forests</li>
                </ul>
              </li>
              <li>
                <strong>
                  <a
                    href="https://www.rockandsnow.com/store/"
                    target="_blank"
                  >
                    Rock and Snow
                  </a></strong>
                <ul className="list-[circle] list-outside space-y-1 pl-4 mt-1">
                  <li>Outdoor shop in New Paltz offering gear rentals</li>
                  <li>If you book in advance, you could reserve some bikes and explore the Hudson Valley trail</li>
                </ul>
              </li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}
