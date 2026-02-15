import { Users, Briefcase, Code2, Gauge } from "lucide-react"

export function BentoSection() {
    return (
        <section className="py-20 md:py-32">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mx-auto mb-16 max-w-3xl text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                        Built for every role in your organization
                    </h2>
                    <p className="mt-4 text-lg text-muted-foreground">
                        From individual developers to CTOs, DevMetrics provides tailored insights for everyone.
                    </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {/* Large card - Engineering Leads */}
                    <div className="row-span-2 rounded-2xl border border-border bg-card p-8">
                        <div className="mb-6 inline-flex rounded-xl bg-primary/10 p-4">
                            <Users className="h-8 w-8 text-primary" />
                        </div>
                        <h3 className="mb-3 text-2xl font-bold text-foreground">Engineering Leads</h3>
                        <p className="mb-6 text-muted-foreground">
                            See productivity, performance, and team health at a glance. Make informed decisions with real-time
                            dashboards and automated weekly reports.
                        </p>
                        <div className="space-y-4">
                            <div className="rounded-lg bg-secondary/50 p-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">Sprint Progress</span>
                                    <span className="text-sm font-medium text-primary">78%</span>
                                </div>
                                <div className="mt-2 h-2 rounded-full bg-muted">
                                    <div className="h-2 w-[78%] rounded-full bg-primary" />
                                </div>
                            </div>
                            <div className="rounded-lg bg-secondary/50 p-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">Team Velocity</span>
                                    <span className="text-sm font-medium text-green-400">+12%</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Developers card */}
                    <div className="rounded-2xl border border-border bg-card p-8">
                        <div className="mb-4 inline-flex rounded-xl bg-primary/10 p-3">
                            <Code2 className="h-6 w-6 text-primary" />
                        </div>
                        <h3 className="mb-2 text-xl font-bold text-foreground">Developers</h3>
                        <p className="text-sm text-muted-foreground">
                            Understand personal metrics and improve your workflow with actionable insights.
                        </p>
                    </div>

                    {/* Product Managers card */}
                    <div className="rounded-2xl border border-border bg-card p-8">
                        <div className="mb-4 inline-flex rounded-xl bg-primary/10 p-3">
                            <Briefcase className="h-6 w-6 text-primary" />
                        </div>
                        <h3 className="mb-2 text-xl font-bold text-foreground">Product Managers</h3>
                        <p className="text-sm text-muted-foreground">
                            Predict delivery timelines and understand team capacity with data-driven estimates.
                        </p>
                    </div>

                    {/* CTOs card - wide */}
                    <div className="rounded-2xl border border-border bg-card p-8 lg:col-span-2">
                        <div className="flex flex-col gap-6 md:flex-row md:items-center">
                            <div className="flex-1">
                                <div className="mb-4 inline-flex rounded-xl bg-primary/10 p-3">
                                    <Gauge className="h-6 w-6 text-primary" />
                                </div>
                                <h3 className="mb-2 text-xl font-bold text-foreground">CTOs & Leadership</h3>
                                <p className="text-muted-foreground">
                                    Connect engineering outputs to business outcomes. Get executive dashboards that translate developer
                                    metrics into strategic insights.
                                </p>
                            </div>
                            <div className="grid grid-cols-2 gap-4 md:w-64">
                                <div className="rounded-lg bg-secondary/50 p-4 text-center">
                                    <div className="text-2xl font-bold text-foreground">4.2x</div>
                                    <div className="text-xs text-muted-foreground">ROI</div>
                                </div>
                                <div className="rounded-lg bg-secondary/50 p-4 text-center">
                                    <div className="text-2xl font-bold text-primary">92%</div>
                                    <div className="text-xs text-muted-foreground">Accuracy</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}