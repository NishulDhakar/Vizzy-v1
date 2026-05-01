.PHONY: dev dev-api dev-web install install-api install-web build lint clean

# Start both services in parallel
dev:
	make -j2 dev-api dev-web

dev-api:
	cd apps/api && source venv/bin/activate && uvicorn main:app --reload --port 8001

dev-web:
	cd apps/web && npm run dev

# Install all dependencies
install: install-api install-web

install-api:
	cd apps/api && python -m venv venv && source venv/bin/activate && pip install -r requirements.txt

install-web:
	cd apps/web && npm install

build:
	cd apps/web && npm run build

lint:
	cd apps/web && npm run lint

clean:
	rm -rf apps/web/.next apps/web/node_modules apps/api/__pycache__ apps/api/**/__pycache__
