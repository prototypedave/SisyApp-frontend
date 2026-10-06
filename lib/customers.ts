import { flaskRequest } from "@/lib/flask";

export async function getCustomers( search = "", page = 1, perPage = 20, includeArchived = false ) {
    const params = new URLSearchParams();
    if (search) { params.set("search", search); }
    params.set("page", String(page));
    params.set("per_page", String(perPage));
    params.set("include_archived", String(includeArchived));
    return flaskRequest(`/customers?${params.toString()}`,
        {
            method: "GET",
            authenticated: true,
        }
    );
}