<template>
  <main id="about-content">
    <article>
      <h1>About</h1>
      <h2>What is "Overthinking Code"?</h2>
      <div class="about-row">
        <p>
          Overthinking Code, is part technical blog, part journaling device.
          It's a place to keep track of the tools, techniques, and other items
          that I find useful or interesting, and may be of use in the future. In
          short, a place to collect all the odd bits and pieces of
          experimentation I do and to reflect on that experience.
        </p>
      </div>
      <div class="about-row">
        <p>
          As for the title itself and why the blog is called "Overthinking
          Code", it is part personal habit, part call to action. I believe by
          asking "what if?", by implementing the sometimes silly or overkill
          solutions, that along the way we learn something of value, regardless
          if the ultimate product matters or not. Or more concisely, the journey
          to the solution is just as important, if not more so, than the
          ultimate destination.
        </p>
      </div>
      <h2>Who is Xinke Chen</h2>
      <div class="about-row">
        <p>
          I am Xinke Chen, webmaster and author of the blog you're currently on
          right now. I have a B.S. Computer Science from the University of
          Pittsburgh with a Minor in Economics. As you might expect, I care
          quite about technology and experimenting with it. In my journey in
          becoming a better software engineer, I have played with and tried to
          learn quite a few different frameworks, languages and ecosystems. From
          iOS with Objective-C and Swift, to PostgreSQL and Vue with JavaScript,
          my curiosity with technology and software is quite diverse.
        </p>
        <img
          src="~/assets/images/profile.jpg"
          alt="picture of the author, Xinke Chen"
        />
      </div>
      <div class="about-row">
        <p>
          Beyond just computers, I also love photography, specifically, astro
          and night landscapes. Again, along with the theme of experimenting
          (and as a constraint of my location), I like these type of subjects
          specifically to see how far I push the camera technically, to see what
          even the eye can't see. There's something special in capturing
          something that otherwise would not exist were it not for the presence
          and ability of the camera.
        </p>
        <img
          src="~/assets/images/cathedral-startrails.jpg"
          alt="Startrails over the Cathedral of Learning (Pittsburgh Oct. 2017)"
        />
      </div>
    </article>
  </main>
</template>

<script>
export default {
  head() {
    return {
      title: 'About Overthinking Code',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content:
            'A page on what "Overthinking Code" is and why the blog exists',
        },
      ],
    };
  },
};
</script>

<style lang="scss">
#about-content {
  box-sizing: border-box;
  font-size: 20px;
  margin-bottom: 20vh;
  max-width: $content-max-width + 20;
  text-align: left;
  width: 85%;
  h1 {
    font-size: 2.75em;
  }
  h2 {
    font-size: 1.75em;
    margin: 1em 0 1em 0;
  }
}
.about-row {
  align-items: flex-start;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-around;
  margin: 1em 0 1em 0;
  p {
    display: block;
    flex: 2 1 50%;
    line-height: 1.4em;
  }
  img {
    box-sizing: border-box;
    display: block;
    flex: 1 1 auto;
    height: min-auto;
    width: 25%;
    margin: 0 1em 0 1em;
  }
  @media screen and (max-width: $tablet-max-width - 1) {
    flex-direction: row;
    margin: 1em 0 1em 0;
    img {
      height: 20%;
      min-width: 250px;
      margin: 1em;
      justify-self: center;
    }
  }
}
</style>
