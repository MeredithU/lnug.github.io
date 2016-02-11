#!/usr/bin/env node

'use strict'

var speclate = require('speclate')

var nextEvent = require('../lib/next-event-from-file')
var generateMaps = require('../lib/generate-maps')
var titoLink = require('../lib/tito-link')

var sponsorSelectors = require('../lib/sponsors-selectors')

var venue = require('../data/venues/makers.json')

var eventDate = nextEvent()
var sponsors = require('../data/sponsors.json')

var spec = {
  '/index.html': {
    page: 'home',
    spec: {
      '.lnug-ticket': {
        component: 'ticket',
        data: {
          '.lnug-nextmeetup': eventDate,
          '.venue': venue.title,
          '.detail': venue.detail,
          'address': venue.address.join('<br />'),
          '.address a': {
            href: 'https://www.google.co.uk/maps/search/' + venue.address.join(', ')
          },
          'a.cta': {
            'href': titoLink()
          }
        }
      },
      '.lnug-content': {
        component: 'speaker',
        data: require('../lib/speaker-selectors')
      },
      '.lnug-mailing-list': {
        component: 'sign-up'
      }
    }
  },
  '/archive.html': {
    page: 'archive',
    spec: {
      'ul.archive': {
        component: 'archive',
        data: require('../lib/archive-selectors')
      }
    }
  },
  '/code-of-conduct.html': {
    page: 'code-of-conduct'
  },
  '/speak.html': {
    page: require('../lib/markdown')('https://raw.githubusercontent.com/lnug/speakers/master/README.md')
  },
  '/sponsor.html': {
    page: require('../lib/markdown')('https://raw.githubusercontent.com/lnug/resources/master/sponsors.md'),
    spec: {
      '.gold-sponsor': {
        component: 'sponsor',
        data: sponsorSelectors(sponsors.gold)
      },
      '.silver-sponsor': {
        component: 'sponsor',
        data: sponsorSelectors(sponsors.silver)
      },
      '.bronze-sponsor': {
        component: 'sponsor',
        data: sponsorSelectors(sponsors.bronze)
      },
      '.community-sponsor': {
        component: 'sponsor',
        data: sponsorSelectors(sponsors.community)
      }
    }
  },
  '/contact.html': {
    page: require('../lib/markdown')('https://raw.githubusercontent.com/lnug/feedback/master/ORGANISERS.md')
  },
  '/related-meetups.html': {
    page: require('../lib/markdown')('https://raw.githubusercontent.com/lnug/related-meetups/master/README.md')
  }
}

generateMaps(venue.location)
speclate.generate(spec, function (error) {
  if (error) {
    console.log('Error generating site: ', error)
  }
})
speclate.appCache(spec, [
  '/css.css',
  '/app-cache-nanny.js',
  '/',
  '/images/lnug-logo.svg',
  '/images/maps/thin.png',
  '/images/maps/wide.png'
])
