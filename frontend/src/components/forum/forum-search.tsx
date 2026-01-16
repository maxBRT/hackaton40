import { Item, ItemContent } from "@/components/ui/item.tsx";
import { Field, FieldGroup } from "@/components/ui/field.tsx";
import { Input } from "@/components/ui/input.tsx";

interface ForumSearchBarProps {
    value: string;
    onChange: (value: string) => void;
}
export function ForumSearchBar({ value, onChange }: ForumSearchBarProps) {
    return (
        <Item
            variant="outline"
            className="max-w-4xl mx-auto mb-4 p-4"
        >
            <ItemContent>
                <FieldGroup>
                    <Field className="flex flex-row">
                        <Input
                            type="text"
                            placeholder="Rechercher une question…"
                            value={value}
                            onChange={(e) => onChange(e.target.value)}
                            className=" h-12 text-base rounded-lg px-2"
                        />
                    </Field>
                </FieldGroup>
            </ItemContent>
        </Item>
    );
}
