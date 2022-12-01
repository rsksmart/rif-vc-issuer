PORT ?= 3000
VERSION ?= 1.0.0
ENV_FILE_PATH ?= .env
CONTAINER_NAME = rif-provider-service-validation:${VERSION}

all: clean build run

clean:
	- docker stop ${CONTAINER_NAME}
	- docker rm ${CONTAINER_NAME}
	- docker rmi ${CONTAINER_NAME}

.PHONY: build
build:
	docker build -t ${CONTAINER_NAME} .

.PHONY: run
run:
	docker run -dit -p ${PORT}:3000 --env-file ${ENV_FILE_PATH} ${CONTAINER_NAME}