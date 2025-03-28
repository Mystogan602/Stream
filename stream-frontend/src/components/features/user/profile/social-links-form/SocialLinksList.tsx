import {
	DragDropContext,
	Draggable,
	type DropResult,
	Droppable
} from '@hello-pangea/dnd';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { Separator } from '@/components/ui/common/Separator';

import {
	useFindSocialLinksQuery,
	useReorderSocialLinksMutation
} from '@/graphql/generated/output';

import { SocialLinkItem } from './SocialLinksItem';

export function SocialLinksList() {
	const t = useTranslations('dashboard.settings.profile.socialLinks');

	const { data, refetch } = useFindSocialLinksQuery();
	const items = data?.socialLinks ?? [];

	const [socialLinks, setSocialLinks] = useState(items);

	useEffect(() => {
		setSocialLinks(items);
	}, [items]);

	const [reorder, { loading: isLoadingReorder }] =
		useReorderSocialLinksMutation({
			onCompleted() {
				refetch();
				toast.success(t('successReorderMessage'));
			},
			onError() {
				toast.error(t('errorReorderMessage'));
			}
		});

	function onDragEnd(result: DropResult) {
		if (!result.destination) return;

		const items = Array.from(socialLinks);
		const [reorderedItem] = items.splice(result.source.index, 1);
		items.splice(result.destination.index, 0, reorderedItem);

		const bulkUpdateData = items.map((socialLink, index) => ({
			id: socialLink.id,
			position: index
		}));

		setSocialLinks(items);
		reorder({ variables: { list: bulkUpdateData } });
	}

	return socialLinks.length ? (
		<>
			<Separator />
			<div className='mt-5 px-5'>
				<DragDropContext onDragEnd={onDragEnd}>
					<Droppable droppableId='socialLinks'>
						{provided => (
							<div
								ref={provided.innerRef}
								{...provided.droppableProps}
							>
								{socialLinks.map((socialLink, index) => (
									<Draggable
										key={socialLink.id}
										draggableId={socialLink.id}
										index={index}
										isDragDisabled={isLoadingReorder}
									>
										{provided => (
											<SocialLinkItem
												key={index}
												socialLink={socialLink}
												provided={provided}
											/>
										)}
									</Draggable>
								))}
								{provided.placeholder}
							</div>
						)}
					</Droppable>
				</DragDropContext>
			</div>
		</>
	) : null;
}
