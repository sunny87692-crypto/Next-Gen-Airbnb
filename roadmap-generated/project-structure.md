# Fixed Project Structure

The PDF defines a fixed structure for the project. Do not reorganize or introduce services outside this layout without a planned decision.

```
your-app/
├── apps/
│   ├── web/                  # Next.js 14 web app
│   └── mobile/               # React Native + Expo app
├── services/
│   ├── gateway/              # Apollo GraphQL Gateway
│   ├── auth-service/         # Node.js + Fastify (Auth & Users)
│   ├── core-service/         # Go + Gin (High-performance logic)
│   ├── business-service/     # Java Spring Boot (Business rules)
│   └── ai-service/           # Python + FastAPI (AI/ML)
├── proto/                    # Shared Protobuf definitions
├── infra/
│   ├── docker/               # Dockerfiles for each service
│   ├── k8s/                  # Kubernetes manifests
│   ├── terraform/            # Infrastructure as Code
│   └── monitoring/           # Prometheus + Grafana configs
└── .github/
    └── workflows/            # GitHub Actions CI/CD
```

Notes:
- `apps/web` is the primary Next.js user interface.
- `apps/mobile` is the React Native/Expo mobile app.
- `services/gateway` is the GraphQL gateway for the backend services.
- `services/auth-service` is the authentication and user service.
- `services/core-service` and `services/business-service` are separate backend microservices.
- `services/ai-service` is the AI/ML microservice.
