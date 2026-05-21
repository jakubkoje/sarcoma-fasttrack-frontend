# Convenience targets for local development.

NPM ?= npm

ifneq (,$(wildcard .env))
include .env
export $(shell sed -n 's/^\([^#][^=]*\)=.*$$/\1/p' .env)
endif

.PHONY: install dev build build-wc preview preview-wc generate test test-smoke test-functional test-e2e

install:
	$(NPM) install

dev:
	$(NPM) run dev

build:
	$(NPM) run build

build-wc:
	$(NPM) run build:wc

preview:
	$(NPM) run preview

preview-wc:
	$(NPM) run preview:wc

generate:
	$(NPM) run generate

test:
	$(NPM) run test

test-smoke:
	$(NPM) run test:smoke

test-functional:
	$(NPM) run test:functional

test-e2e:
	$(NPM) run test:e2e
