.PHONY: install dev start-backend start-frontend 

install:
	cd backend && npm install
	cd frontend && npm install

start-backend:
	cd backend && npm run dev

start-frontend:
	cd frontend && npm run dev

dev:
	$(MAKE) -j2 start-backend start-frontend
